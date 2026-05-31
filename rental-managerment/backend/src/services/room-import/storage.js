const { AppDataSource } = require("../../config/db");
const bcrypt = require("bcryptjs");

class RoomImportStorage {
  async saveRows(rows) {
    console.log(`\n🚀 [IMPORT] Bắt đầu lưu ${rows.length} dòng dữ liệu vào DB...`);
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const masterCache = new Map();
      const userCache = new Map();

      const batchMasterNames = new Map();
      rows.forEach(r => {
        if (r.masterPhone && r.masterName && !batchMasterNames.has(r.masterPhone)) {
          batchMasterNames.set(r.masterPhone, r.masterName.trim());
        }
      });

      const savedRows = [];

      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        let currentItem = item; // Giữ tham chiếu để log lỗi nếu cần
        try {
          const masterName = item.masterName || batchMasterNames.get(item.masterPhone);

          console.log(`\n--- [Dòng ${i + 1}/${rows.length}] Đang xử lý: Phòng ${item.roomNumber} ---`);
          console.log(`👉 Dữ liệu đầy đủ:`, JSON.stringify(item, null, 2));

          if (!item.masterName && masterName) {
            console.log(`   ℹ️ Tự động điền tên chủ trọ [${masterName}] từ dữ liệu cùng lô.`);
          }

        // 1. Xử lý Master (Chủ trọ)
        const mKey = item.masterPhone || item.masterEmail;
        let master = masterCache.get(mKey);

        if (!master) {
          // Tìm theo phone trước, nếu không có thì tìm theo email
          if (item.masterPhone) {
            master = await queryRunner.manager.findOne("Master", { where: { phone: item.masterPhone } });
          }
          if (!master && item.masterEmail) {
            master = await queryRunner.manager.findOne("Master", { where: { email: item.masterEmail } });
          }
        }

        if (!master) {
          console.log(`   👉 Tạo mới Chủ trọ: ${masterName || 'Chưa rõ'} - ${item.masterPhone || item.masterEmail}`);
          master = await queryRunner.manager.save("Master", {
            name: masterName,
            phone: item.masterPhone,
            email: item.masterEmail,
            address: item.masterAddress
          });

          // Tạo tài khoản (Dùng phone làm username, nếu ko có dùng email)
          const username = item.masterPhone || item.masterEmail;
          const existingMasterAccount = await queryRunner.manager.findOne("Account", {
            where: { username, role: "master" }
          });

          if (!existingMasterAccount) {
            console.log(`      (Tạo tài khoản Account cho Chủ trọ)`);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("123456", salt);
            await queryRunner.manager.save("Account", {
              username: username,
              password: hashedPassword,
              role: "master",
              masterId: master.id,
              status: "active"
            });
          }
          masterCache.set(mKey, master);
        } else {
          console.log(`✅ Sử dụng Master cũ: ${master.name}`);
          // Cache lại để dùng cho các dòng sau
          if (mKey) masterCache.set(mKey, master);
        }

        // 2. Xử lý Tenant (Khách thuê)
        let tenant = null;
        if (item.tenantPhone) {
          tenant = userCache.get(item.tenantPhone);
          if (!tenant) {
            tenant = await queryRunner.manager.findOne("User", { where: { phone: item.tenantPhone } });
          }
          if (!tenant) {
            console.log(`👉 Tạo mới Khách thuê: ${item.tenantName} - ${item.tenantPhone}`);
            tenant = await queryRunner.manager.save("User", {
              name: item.tenantName || "Khách thuê",
              phone: item.tenantPhone,
              email: item.tenantEmail || null
            });
            // Kiểm tra Account đã tồn tại chưa trước khi tạo mới
            const existingUserAccount = await queryRunner.manager.findOne("Account", {
              where: { username: item.tenantPhone, role: "user" }
            });
            if (!existingUserAccount) {
              console.log(`(Tạo tài khoản Account cho Khách thuê)`);
              const salt = await bcrypt.genSalt(10);
              const hashedUserPassword = await bcrypt.hash("123456", salt);
              await queryRunner.manager.save("Account", {
                username: item.tenantPhone,
                password: hashedUserPassword,
                role: "user",
                userId: tenant.id,
                status: "active"
              });
            }
            userCache.set(item.tenantPhone, tenant);
          } else {
            console.log(`✅ Sử dụng Khách thuê đã có: ${tenant.name}`);
          }
        }

        // 3. Xử lý Room (Phòng)
        const roomStatus = tenant ? 1 : (item.status === 'Đã thuê' ? 1 : 0);
        const room = await queryRunner.manager.save("Room", {
          roomNumber: item.roomNumber,
          title: item.title,
          price: item.price,
          area: item.area,
          capacity: item.capacity,
          city: item.city,
          district: item.district,
          ward: item.ward,
          location: item.location,
          description: item.description,
          amenities: (typeof item.amenities === 'string' && item.amenities.trim())
            ? item.amenities.split(",").map(s => s.trim())
            : [],
          isTrending: item.isTrending === 'Có' || item.isTrending === true,
          thumbnail: "https://res.cloudinary.com/ddcxppxll/image/upload/v1712739324/default-room_vjwf1z.jpg",
          master: master,
          status: roomStatus
        });

        // 4. Tạo Hợp đồng (Nếu có khách thuê)
        if (tenant) {
          console.log(`   📑 Tạo hợp đồng thuê phòng ${room.roomNumber} cho ${tenant.name}`);
          await queryRunner.manager.save("Contract", {
            price: item.price,
            startDate: item.startDate || new Date(),
            endDate: item.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 1,
            deposit: item.deposit || 0,
            userId: tenant.id,
            roomId: room.id,
            masterId: master.id
          });
        }

        savedRows.push({
          roomNumber: item.roomNumber,
          masterName: masterName,
          price: item.price,
          tenantName: item.tenantName || (tenant ? tenant.name : null),
          status: roomStatus === 1 ? 'Đã thuê' : 'Trống'
        });
        } catch (err) {
          console.error(`\n💥 LỖI XỬ LÝ DÒNG ${i + 1}:`, err.message);
          console.error(`👉 Row Context:`, JSON.stringify(item, null, 2));
          throw err; // Tiếp tục throw để outer block handle rollback
        }
      }
      await queryRunner.commitTransaction();
      console.log(`\n✨ IMPORT HOÀN TẤT! Đã lưu thành công ${rows.length} dòng.`);
      return {
        count: rows.length,
        savedRows
      };
    } catch (err) {
      console.error(`\n💥 LỖI KHI LƯU DB TẠI DÒNG:`, err.message);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

module.exports = new RoomImportStorage();
