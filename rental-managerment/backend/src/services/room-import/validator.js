const { AppDataSource } = require("../../config/db");

class RoomImportValidator {
  /**
   * Kiểm tra toàn bộ dữ liệu Excel trước khi import
   */
  async validate(rows) {
    const validationErrors = [];
    const roomRepo = AppDataSource.getRepository("Room");

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
    rows.forEach((item, index) => {
      const rNum = item.roomNumber?.toString().trim();
      const rowLabel = item.excelRow || (index + 1);

      // --- 1. KIỂM TRA TRƯỜNG BẮT BUỘC CỦA CHỦ TRỌ & PHÒNG ---
      if (!item.masterName) validationErrors.push(`Dòng ${rowLabel}: Thiếu họ tên chủ trọ.`);
      if (!item.masterPhone) validationErrors.push(`Dòng ${rowLabel}: Thiếu SĐT chủ trọ.`);
      if (!rNum) validationErrors.push(`Dòng ${rowLabel}: Thiếu số phòng.`);
      if (!item.city || !item.district || !item.ward) validationErrors.push(`Dòng ${rowLabel}: Thiếu thông tin địa giới (Tỉnh/Huyện/Xã).`);
      if (!item.price) validationErrors.push(`Dòng ${rowLabel}: Thiếu giá thuê phòng.`);

      // --- 2. KIỂM TRA LOGIC NHÓM THÔNG TIN THUÊ (NGƯỜI THUÊ & HỢP ĐỒNG) ---
      const hasTenantInfo = !!(item.tenantPhone || item.tenantName); // ép kiểu boolean thiéu một trong thiếu cả 2 thì là false và thiếu 1 thôi thì là true 
      const hasContractInfo = !!(item.startDate || item.endDate || item.deposit);

      // Quy tắc A: Nếu có bất kỳ thông tin nào của người thuê hoặc hợp đồng, thì TẤT CẢ phải đầy đủ
      if (hasTenantInfo || hasContractInfo) {
        if (!item.tenantPhone) validationErrors.push(`Dòng ${rowLabel}: Thiếu SĐT người thuê (Phải điền đầy đủ cả nhóm thông tin thuê).`);
        if (!item.tenantName) validationErrors.push(`Dòng ${rowLabel}: Thiếu Họ tên người thuê (Phải điền đầy đủ cả nhóm thông tin thuê).`);
        if (!item.startDate) validationErrors.push(`Dòng ${rowLabel}: Thiếu Ngày bắt đầu hợp đồng.`);
        if (!item.endDate) validationErrors.push(`Dòng ${rowLabel}: Thiếu Ngày kết thúc hợp đồng.`);

        // Trạng thái phòng cũng không được để trống và phải là Đã thuê
        if (!item.status) {
          validationErrors.push(`Dòng ${rowLabel}: Có thông tin thuê nhưng thiếu Trạng thái phòng.`);
        } else if (item.status !== "Đã thuê") {
          validationErrors.push(`Dòng ${rowLabel}: Có người thuê thì Trạng thái phòng phải là "Đã thuê".`);
        }
      }
      // Quy tắc B: Nếu KHÔNG có người thuê thì KHÔNG ĐƯỢC có nội dung thuê phòng/hợp đồng
      else {
        if (item.status === "Đã thuê") {
          validationErrors.push(`Dòng ${rowLabel}: Trạng thái phòng là "Đã thuê" nhưng không có thông tin người thuê và hợp đồng.`);
        }
      }

      // --- 3. KIỂM TRA ĐỊA CHÍNH KHỚP NHAU ---
      if (locationMap.size > 0 && item.city && item.district && item.ward) {
        const province = locationMap.get(item.city);
        if (!province) {
          validationErrors.push(`Dòng ${rowLabel}: Thông tin về tỉnh thành chưa khớp nhau (Tỉnh/Thành không tồn tại).`);
        } else {
          const wardsOfDistrict = province.get(item.district);
          if (!wardsOfDistrict) {
            validationErrors.push(`Dòng ${rowLabel}: Thông tin về tỉnh thành chưa khớp nhau (Huyện không nằm trong Tỉnh).`);
          } else if (!wardsOfDistrict.has(item.ward)) {
            validationErrors.push(`Dòng ${rowLabel}: Thông tin về tỉnh thành chưa khớp nhau (Xã không nằm trong Huyện).`);
          }
        }
      }

      if (!rNum) return;
      if (seenRoomNumbersInFile.has(rNum)) {
        validationErrors.push(`Dòng ${rowLabel}: Số phòng "${rNum}" bị lặp lại trong chính file Excel.`);
      }
      seenRoomNumbersInFile.add(rNum);
    });

    // 2. Kiểm tra trùng lặp VỚI DATABASE
    if (rows.length > 0) {
      const roomNumbers = rows.map(r => r.roomNumber?.toString().trim()).filter(Boolean);
      const existingRooms = await roomRepo.createQueryBuilder("room")
        .where("room.roomNumber IN (:...roomNumbers)", { roomNumbers })
        .getMany();

      const existingSet = new Set(existingRooms.map(r => r.roomNumber));

      rows.forEach((item, index) => {
        const rNum = item.roomNumber?.toString().trim();
        const rowLabel = item.excelRow || (index + 1);
        if (rNum && existingSet.has(rNum)) {
          validationErrors.push(`Dòng ${rowLabel}: Số phòng "${rNum}" đã tồn tại trên hệ thống.`);
        }
      });
    }

    return validationErrors;
  }
}

module.exports = new RoomImportValidator();
