const { AppDataSource } = require("../../config/db");

class RoomImportValidator {
  /**
   * Kiểm tra toàn bộ dữ liệu Excel trước khi import
   */
  async validate(rows) {
    const validationErrors = [];
    const roomRepo = AppDataSource.getRepository("Room");

    // Helper to log and push error
    const addError = (msg, item) => {
      validationErrors.push(msg);
      console.log(`❌ [VALIDATION ERROR]: ${msg}`);
      console.log(`   Detailed Data:`, JSON.stringify(item, null, 2));
    };

    // 0. FETCH DỮ LIỆU ĐỊA CHÍNH ĐỂ ĐỐI SOÁT
    let locationMap = new Map();
    try {
      const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
      const resp = await fetch('https://provinces.open-api.vn/api/?depth=3');
      if (resp.ok) {
        const provinces = await resp.json();
        provinces.forEach(p => {
          const districtsMap = new Map();
          (p.districts || []).forEach(d => {
            const wardsSet = new Set((d.wards || []).map(w => w.name));
            districtsMap.set(d.name, wardsSet);
          });
          locationMap.set(p.name, districtsMap);
        });
      }
    } catch (err) {
      console.error("❌ Lỗi fetch địa chính để validate:", err.message);
      // Fallback: Nếu không fetch được thì tạm thời bỏ qua bước logic địa chính này để không chặn đứng hệ thống
    }

    // 1. Kiểm tra trùng lặp NGAY TRONG FILE EXCEL
    const seenRoomNumbersInFile = new Set();
    const internalMasterMap = new Map(); // phone -> { name, email }
    const internalTenantMap = new Map(); // phone -> { name, email }

    rows.forEach((item, index) => {
      const rNum = item.roomNumber?.toString().trim();
      const rowLabel = item.excelRow || (index + 1);

      const mPhone = item.masterPhone?.toString().trim();
      const mEmail = item.masterEmail?.toString().trim();
      const tPhone = item.tenantPhone?.toString().trim();
      const tEmail = item.tenantEmail?.toString().trim();

      if (!mPhone) addError(`Dòng ${rowLabel}: Thiếu SĐT chủ trọ.`, item);
      if (!rNum) addError(`Dòng ${rowLabel}: Thiếu số phòng.`, item);
      if (!item.city || !item.district || !item.ward) addError(`Dòng ${rowLabel}: Thiếu thông tin địa giới (Tỉnh/Huyện/Xã).`, item);
      if (!item.price) addError(`Dòng ${rowLabel}: Thiếu giá thuê phòng.`, item);

      // --- 1.1 KIỂM TRA NHẤT QUÁN NỘI BỘ (TRONG FILE) ---
      if (mPhone) {
        if (!internalMasterMap.has(mPhone)) {
          internalMasterMap.set(mPhone, { name: item.masterName, email: mEmail, firstRow: rowLabel });
        } else {
          const existing = internalMasterMap.get(mPhone);
          // Cập nhật tên cho map nội bộ nếu dòng này có tên mà các dòng trước chưa có
          if (!existing.name && item.masterName) {
            existing.name = item.masterName;
          }
          if (item.masterName && existing.name && existing.name !== item.masterName) {
            addError(`Dòng ${rowLabel}: SĐT Chủ trọ ${mPhone} đang bị xung đột thông tin (Dòng ${existing.firstRow} tên là [${existing.name}], Dòng ${rowLabel} tên là [${item.masterName}]).`, item);
          }
          if (mEmail && existing.email && existing.email !== mEmail) {
            addError(`Dòng ${rowLabel}: SĐT Chủ trọ ${mPhone} đang bị xung đột Email (Dòng ${existing.firstRow} email là [${existing.email}], Dòng ${rowLabel} email là [${mEmail}]).`, item);
          }
        }
      }

      if (tPhone) {
        if (!internalTenantMap.has(tPhone)) {
          internalTenantMap.set(tPhone, { name: item.tenantName, email: tEmail, firstRow: rowLabel });
        } else {
          const existing = internalTenantMap.get(tPhone);
          if (existing.name !== item.tenantName) {
            addError(`Dòng ${rowLabel}: SĐT Khách thuê ${tPhone} đang bị xung đột thông tin (Dòng ${existing.firstRow} tên là [${existing.name}], Dòng ${rowLabel} tên là [${item.tenantName}]).`, item);
          }
          if (tEmail && existing.email && existing.email !== tEmail) {
            addError(`Dòng ${rowLabel}: SĐT Khách thuê ${tPhone} đang bị xung đột Email (Dòng ${existing.firstRow} email là [${existing.email}], Dòng ${rowLabel} email là [${tEmail}]).`, item);
          }
        }
      }

      // --- 2. KIỂM TRA LOGIC NHÓM THÔNG TIN THUÊ (NGƯỜI THUÊ & HỢP ĐỒNG) ---
      const hasTenantInfo = !!(item.tenantPhone || item.tenantName); // ép kiểu boolean thiéu một trong thiếu cả 2 thì là false và thiếu 1 thôi thì là true 
      const hasContractInfo = !!(item.startDate || item.endDate || item.deposit);

      // Quy tắc A: Nếu có bất kỳ thông tin nào của người thuê hoặc hợp đồng, thì TẤT CẢ phải đầy đủ
      if (hasTenantInfo || hasContractInfo) {
        if (!item.tenantPhone) addError(`Dòng ${rowLabel}: Thiếu SĐT người thuê (Phải điền đầy đủ cả nhóm thông tin thuê).`, item);
        if (!item.tenantName) addError(`Dòng ${rowLabel}: Thiếu Họ tên người thuê (Phải điền đầy đủ cả nhóm thông tin thuê).`, item);
        if (!item.startDate) addError(`Dòng ${rowLabel}: Thiếu Ngày bắt đầu hợp đồng.`, item);
        if (!item.endDate) addError(`Dòng ${rowLabel}: Thiếu Ngày kết thúc hợp đồng.`, item);

        // Trạng thái phòng cũng không được để trống và phải là Đã thuê
        if (!item.status) {
          addError(`Dòng ${rowLabel}: Có thông tin thuê nhưng thiếu Trạng thái phòng.`, item);
        } else if (item.status !== "Đã Thuê") {
          addError(`Dòng ${rowLabel}: Có người thuê thì Trạng thái phòng phải là "Đã Thuê".`, item);
        }
      }
      // Quy tắc B: Nếu KHÔNG có người thuê thì KHÔNG ĐƯỢC có nội dung thuê phòng/hợp đồng
      else {
        if (item.status === "Đã Thuê") {
          addError(`Dòng ${rowLabel}: Trạng thái phòng là "Đã thuê" nhưng không có thông tin người thuê và hợp đồng.`, item);
        }
      }

      // --- 3. KIỂM TRA ĐỊA CHÍNH KHỚP NHAU ---
      if (locationMap.size > 0 && item.city && item.district && item.ward) {
        const province = locationMap.get(item.city);
        if (!province) {
          addError(`Dòng ${rowLabel}: Thông tin về tỉnh thành chưa khớp nhau (Tỉnh/Thành không tồn tại).`, item);
        } else {
          const wardsOfDistrict = province.get(item.district);
          if (!wardsOfDistrict) {
            addError(`Dòng ${rowLabel}: Thông tin về tỉnh thành chưa khớp nhau (Huyện không nằm trong Tỉnh).`, item);
          } else if (!wardsOfDistrict.has(item.ward)) {
            addError(`Dòng ${rowLabel}: Thông tin về tỉnh thành chưa khớp nhau (Xã không nằm trong Huyện).`, item);
          }
        }
      }

      if (!rNum) return;
      if (seenRoomNumbersInFile.has(rNum)) {
        addError(`Dòng ${rowLabel}: Số phòng "${rNum}" bị lặp lại trong chính file Excel.`, item);
      }
      seenRoomNumbersInFile.add(rNum);
    });

    // 2. Kiểm tra trùng lặp VỚI DATABASE
    if (rows.length > 0) {
      // --- 2.1 KIỂM TRA PHÒNG ---
      const roomNumbers = rows.map(r => r.roomNumber?.toString().trim()).filter(Boolean);
      const existingRooms = await roomRepo.createQueryBuilder("room")
        .where("room.roomNumber IN (:...roomNumbers)", { roomNumbers })
        .getMany();
      const existingRoomSet = new Set(existingRooms.map(r => r.roomNumber));

      // --- 2.2 KIỂM TRA CHỦ TRỌ (MASTER) ---
      const masterRepo = AppDataSource.getRepository("Master");
      const masterPhones = Array.from(internalMasterMap.keys());
      const masterEmails = Array.from(internalMasterMap.values()).map(v => v.email).filter(Boolean);

      const dbMasters = await masterRepo.createQueryBuilder("master")
        .where("master.phone IN (:...masterPhones) OR master.email IN (:...masterEmails)", { masterPhones, masterEmails: masterEmails.length ? masterEmails : ['INVALID'] })
        .getMany();

      // --- 2.3 KIỂM TRA KHÁCH THUÊ (USER) ---
      const userRepo = AppDataSource.getRepository("User");
      const tenantPhones = Array.from(internalTenantMap.keys());
      const tenantEmails = Array.from(internalTenantMap.values()).map(v => v.email).filter(Boolean);

      const dbUsers = await userRepo.createQueryBuilder("user")
        .where("user.phone IN (:...tenantPhones) OR user.email IN (:...tenantEmails)", { tenantPhones, tenantEmails: tenantEmails.length ? tenantEmails : ['INVALID'] })
        .getMany();

      rows.forEach((item, index) => {
        const rNum = item.roomNumber?.toString().trim();
        const rowLabel = item.excelRow || (index + 1);
        const mPhone = item.masterPhone?.toString().trim();
        const mEmail = item.masterEmail?.toString().trim();
        const tPhone = item.tenantPhone?.toString().trim();
        const tEmail = item.tenantEmail?.toString().trim();

        // Check Phòng
        if (rNum && existingRoomSet.has(rNum)) {
          addError(`Dòng ${rowLabel}: Số phòng "${rNum}" đã tồn tại trên hệ thống.`, item);
        }

        // Check Master DB
        if (mPhone || mEmail) {
          const phoneMatch = dbMasters.find(m => m.phone === mPhone);
          const emailMatch = mEmail ? dbMasters.find(m => m.email === mEmail) : null;

          if (phoneMatch && emailMatch && phoneMatch.id !== emailMatch.id) {
            addError(`Dòng ${rowLabel}: SĐT và Email không khớp. SĐT ${mPhone} thuộc về chủ trọ [${phoneMatch.name}], nhưng Email ${mEmail} lại thuộc về chủ trọ [${emailMatch.name}].`, item);
          }

          const conflict = phoneMatch || emailMatch;

          // 2. Logic kiểm tra tên cho Master mới
          const resolvedNameInFile = item.masterName || (mPhone && internalMasterMap.get(mPhone)?.name);

          if (!item.masterName) {
            if (resolvedNameInFile) {
              console.log(`   [VALIDATE] ℹ️ Dòng ${rowLabel}: Tên trống, sẽ dùng tên [${resolvedNameInFile}] từ dòng khác trong file.`);
            } else if (conflict) {
              console.log(`   [VALIDATE] ℹ️ Dòng ${rowLabel}: Tên trống, sẽ dùng tên [${conflict.name}] từ Database.`);
            }
          }

          if (!resolvedNameInFile && !conflict) {
            addError(`Dòng ${rowLabel}: Thiếu họ tên chủ trọ. Đây là chủ trọ mới (chưa có trên hệ thống), vui lòng cung cấp họ tên .`, item);
          }

          if (conflict) {
            // Chỉ kiểm tra xung đột tên nếu trong file có điền tên
            if (item.masterName && mPhone && conflict.phone === mPhone && conflict.name !== item.masterName) {
              addError(`Dòng ${rowLabel}: SĐT Chủ trọ đã tồn tại trên hệ thống với tài khoản khác`, item);
            }
            // Nếu có email trong DB mà phone không khớp (và ko phải do 2 master khác nhau ở trên)
            if (mEmail && conflict.email === mEmail && conflict.phone !== mPhone) {
              addError(`Dòng ${rowLabel}: Email Chủ trọ ${mEmail} đã được đăng ký cho tài khoản khác`, item);
            }
          }
        }

        // Check User DB
        if (tPhone || tEmail) {
          const conflict = dbUsers.find(u => u.phone === tPhone || (tEmail && u.email === tEmail));
          if (conflict) {
            if (tPhone && conflict.phone === tPhone && conflict.name !== item.tenantName) {
              addError(`Dòng ${rowLabel}: SĐT Khách thuê đã tồn tại trên hệ thống.`, item);
            }
            if (tEmail && conflict.email === tEmail && conflict.phone !== tPhone) {
              addError(`Dòng ${rowLabel}: Email Khách thuê đã tồn tại trên hệ thống.`, item);
            }
          }
        }
      });
    }

    return validationErrors;
  }
}

module.exports = new RoomImportValidator();
