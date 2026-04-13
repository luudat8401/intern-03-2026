const { AppDataSource } = require("../config/db");
const bcrypt = require("bcryptjs");
const { PassThrough } = require("stream");
const { cloudinary } = require("../config/cloudinary");
const exportService = require("./export.service");

// In-memory store for export jobs
const exportJobs = new Map();

class RoomExcelService {
  /**
   * Xuất danh sách phòng ra Excel (Dạng Stream cho file lớn)
   */
  async exportRoomsToExcel(res, query) {
    const roomRepo = AppDataSource.getRepository("Room");
    const { status, search, city, district } = query;

    const queryBuilder = roomRepo.createQueryBuilder("room")
      .leftJoinAndSelect("room.master", "master")
      .leftJoinAndSelect("room.contracts", "contracts", "contracts.status = :activeStatus", { activeStatus: 1 })
      .leftJoinAndSelect("contracts.user", "tenant");

    if (status && status !== 'all') {
      queryBuilder.andWhere("room.status = :status", { status: parseInt(status) });
    }
    if (city && city !== 'Chọn Tỉnh/Thành') {
      queryBuilder.andWhere("room.city = :city", { city });
    }
    if (district && district !== 'Chọn Quận/Huyện') {
      queryBuilder.andWhere("room.district = :district", { district });
    }
    if (search) {
      queryBuilder.andWhere("(room.roomNumber ILIKE :search OR room.title ILIKE :search)", { search: `%${search}%` });
    }

    const headers = [
      { label: "Họ tên Chủ trọ", key: "master_name", width: 20 },
      { label: "SĐT Chủ trọ", key: "master_phone", width: 15 },
      { label: "Email Chủ trọ", key: "master_email", width: 25 },
      { label: "Địa chỉ Chủ trọ", key: "master_address", width: 30 },
      { label: "Số phòng", key: "room_number", width: 15 },
      { label: "Tiêu đề", key: "title", width: 30 },
      { label: "Giá thuê", key: "price", width: 15 },
      { label: "Diện tích", key: "area", width: 15 },
      { label: "Sức chứa", key: "capacity", width: 15 },
      { label: "Tỉnh/Thành", key: "city", width: 20 },
      { label: "Quận/Huyện", key: "district", width: 20 },
      { label: "Phường/Xã", key: "ward", width: 20 },
      { label: "Địa chỉ chi tiết", key: "location", width: 50 },
      { label: "Mô tả", key: "description", width: 40 },
      { label: "Tiện ích", key: "amenities", width: 30 },
      { label: "Nổi bật", key: "is_trending", width: 10 },
      { label: "Trạng thái", key: "status", width: 15 },
      { label: "Họ tên người thuê", key: "tenant_name", width: 20 },
      { label: "SĐT người thuê", key: "tenant_phone", width: 15 },
      { label: "Tiền cọc", key: "deposit", width: 15 },
      { label: "Ngày bắt đầu", key: "start_date", width: 15 },
      { label: "Ngày kết thúc", key: "end_date", width: 15 },
    ];

    const statusMap = { 0: "Trống", 1: "Đã thuê", 2: "Đang xử lý", 3: "Bảo trì", 4: "Đã xóa" };

    const { workbook, worksheet } = exportService.createStreamingWorkbook(
      res,
      `Danh_sach_phong_tro_${new Date().getTime()}`,
      headers
    );

    const stream = await queryBuilder.orderBy("room.id", "DESC").stream();

    return new Promise((resolve, reject) => {
      let count = 0;
      stream.on('data', (data) => {
        try {
          count++;
          const mappedRoom = {
            master_name: data.master_name || "N/A",
            master_phone: data.master_phone || "N/A",
            master_email: data.master_email || "N/A",
            master_address: data.master_address || "N/A",
            room_number: data.room_room_number || data.room_roomNumber || "N/A",
            title: data.room_title || "N/A",
            price: data.room_price || 0,
            area: data.room_area || 0,
            capacity: data.room_capacity || 0,
            city: data.room_city || "N/A",
            district: data.room_district || "N/A",
            ward: data.room_ward || "N/A",
            location: data.room_location || "N/A",
            description: data.room_description || "N/A",
            amenities: Array.isArray(data.room_amenities) ? data.room_amenities.join(", ") :
              (typeof data.room_amenities === 'string' ? data.room_amenities : ""),
            is_trending: data.room_is_trending || data.room_isTrending ? "Có" : "Không",
            status: statusMap[data.room_status] || "N/A",
            tenant_name: data.tenant_name || "không",
            tenant_phone: data.tenant_phone || "không",
            deposit: data.contracts_deposit || 0,
            start_date: data.contracts_start_date ? new Date(data.contracts_start_date).toLocaleDateString("vi-VN") : "",
            end_date: data.contracts_end_date ? new Date(data.contracts_end_date).toLocaleDateString("vi-VN") : "",
          };
          worksheet.addRow(mappedRoom).commit();
        } catch (err) {
          console.error(`Lỗi tại dòng ${count}:`, err);
        }
      });

      stream.on('end', async () => {
        await workbook.commit();
        resolve();
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Xuất danh sách phòng theo lô (Batching)
   */
  async exportRoomsToExcelBatch(res, query) {
    const roomRepo = AppDataSource.getRepository("Room");
    const { status, search, city, district } = query;

    const queryBuilder = roomRepo.createQueryBuilder("room")
      .leftJoinAndSelect("room.master", "master")
      .leftJoinAndSelect("room.contracts", "contracts", "contracts.status = :activeStatus", { activeStatus: 1 })
      .leftJoinAndSelect("contracts.user", "tenant");

    if (status && status !== 'all') {
      queryBuilder.andWhere("room.status = :status", { status: parseInt(status) });
    }
    if (city && city !== 'Chọn Tỉnh/Thành') {
      queryBuilder.andWhere("room.city = :city", { city });
    }
    if (district && district !== 'Chọn Quận/Huyện') {
      queryBuilder.andWhere("room.district = :district", { district });
    }
    if (search) {
      queryBuilder.andWhere("(room.roomNumber ILIKE :search OR room.title ILIKE :search)", { search: `%${search}%` });
    }

    const total = await queryBuilder.getCount();
    const batchSize = 10000;
    let offset = 0;

    const headers = [
      { label: "Họ tên Chủ trọ", key: "master_name", width: 20 },
      { label: "SĐT Chủ trọ", key: "master_phone", width: 15 },
      { label: "Email Chủ trọ", key: "master_email", width: 25 },
      { label: "Địa chỉ Chủ trọ", key: "master_address", width: 30 },
      { label: "Số phòng", key: "room_number", width: 15 },
      { label: "Tiêu đề", key: "title", width: 30 },
      { label: "Giá thuê", key: "price", width: 15 },
      { label: "Diện tích", key: "area", width: 15 },
      { label: "Sức chứa", key: "capacity", width: 15 },
      { label: "Tỉnh/Thành", key: "city", width: 20 },
      { label: "Quận/Huyện", key: "district", width: 20 },
      { label: "Phường/Xã", key: "ward", width: 20 },
      { label: "Địa chỉ chi tiết", key: "location", width: 50 },
      { label: "Mô tả", key: "description", width: 40 },
      { label: "Tiện ích", key: "amenities", width: 30 },
      { label: "Nổi bật", key: "is_trending", width: 10 },
      { label: "Trạng thái", key: "status", width: 15 },
      { label: "Họ tên người thuê", key: "tenant_name", width: 20 },
      { label: "SĐT người thuê", key: "tenant_phone", width: 15 },
      { label: "Tiền cọc", key: "deposit", width: 15 },
      { label: "Ngày bắt đầu", key: "start_date", width: 15 },
      { label: "Ngày kết thúc", key: "end_date", width: 15 },
    ];
    const statusMap = { 0: "Trống", 1: "Đã thuê", 2: "Đang xử lý", 3: "Bảo trì", 4: "Đã xóa" };

    const { workbook, worksheet } = exportService.createStreamingWorkbook(res, `Batch_Export`, headers);

    while (offset < total) {
      const rooms = await queryBuilder
        .orderBy("room.id", "DESC")
        .skip(offset)
        .take(batchSize)
        .getMany();

      rooms.forEach(room => {
        worksheet.addRow({
          master_name: room.master?.name || "N/A",
          master_phone: room.master?.phone || "N/A",
          master_email: room.master?.email || "N/A",
          master_address: room.master?.address || "N/A",
          room_number: room.roomNumber || "N/A",
          title: room.title || "N/A",
          price: room.price || 0,
          area: room.area || 0,
          capacity: room.capacity || 0,
          city: room.city || "N/A",
          district: room.district || "N/A",
          ward: room.ward || "N/A",
          location: room.location || "N/A",
          description: room.description || "N/A",
          amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") :
            (typeof room.amenities === 'string' ? room.amenities : ""),
          is_trending: room.isTrending ? "Có" : "Không",
          status: statusMap[room.status] || "Không xác định",
          tenant_name: room.contracts?.[0]?.user?.name || "không",
          tenant_phone: room.contracts?.[0]?.user?.phone || "không",
          deposit: room.contracts?.[0]?.deposit || 0,
          start_date: room.contracts?.[0]?.startDate ? new Date(room.contracts[0].startDate).toLocaleDateString("vi-VN") : "",
          end_date: room.contracts?.[0]?.endDate ? new Date(room.contracts[0].endDate).toLocaleDateString("vi-VN") : "",
        }).commit();
      });
      offset += batchSize;
    }
    await workbook.commit();
  }

  /**
   * Xuất danh sách phòng lên Cloudinary (Chạy ngầm)
   */
  async exportRoomsToCloudinary(jobId, query) {
    const roomRepo = AppDataSource.getRepository("Room");
    const { status, search, city, district } = query;

    exportJobs.set(jobId, { status: "processing", progress: 0, url: null, createdAt: new Date() });

    try {
      const queryBuilder = roomRepo.createQueryBuilder("room")
        .leftJoinAndSelect("room.master", "master")
        .leftJoinAndSelect("room.contracts", "contracts", "contracts.status = :activeStatus", { activeStatus: 1 })
        .leftJoinAndSelect("contracts.user", "tenant");

      if (status && status !== 'all') {
        queryBuilder.andWhere("room.status = :status", { status: parseInt(status) });
      }
      if (city && city !== 'Chọn Tỉnh/Thành') {
        queryBuilder.andWhere("room.city = :city", { city });
      }
      if (district && district !== 'Chọn Quận/Huyện') {
        queryBuilder.andWhere("room.district = :district", { district });
      }
      if (search) {
        queryBuilder.andWhere("(room.roomNumber ILIKE :search OR room.title ILIKE :search)", { search: `%${search}%` });
      }

      const total = await queryBuilder.getCount();
      const headers = [
        { label: "Họ tên Chủ trọ", key: "master_name", width: 20 },
        { label: "SĐT Chủ trọ", key: "master_phone", width: 15 },
        { label: "Email Chủ trọ", key: "master_email", width: 25 },
        { label: "Địa chỉ Chủ trọ", key: "master_address", width: 30 },
        { label: "Số phòng", key: "room_number", width: 15 },
        { label: "Tiêu đề", key: "title", width: 30 },
        { label: "Giá thuê", key: "price", width: 15 },
        { label: "Diện tích", key: "area", width: 15 },
        { label: "Sức chứa", key: "capacity", width: 15 },
        { label: "Tỉnh/Thành", key: "city", width: 20 },
        { label: "Quận/Huyện", key: "district", width: 20 },
        { label: "Phường/Xã", key: "ward", width: 20 },
        { label: "Địa chỉ chi tiết", key: "location", width: 50 },
        { label: "Mô tả", key: "description", width: 40 },
        { label: "Tiện ích", key: "amenities", width: 30 },
        { label: "Nổi bật", key: "is_trending", width: 10 },
        { label: "Trạng thái", key: "status", width: 15 },
        { label: "Họ tên người thuê", key: "tenant_name", width: 20 },
        { label: "SĐT người thuê", key: "tenant_phone", width: 15 },
        { label: "Tiền cọc", key: "deposit", width: 15 },
        { label: "Ngày bắt đầu", key: "start_date", width: 15 },
        { label: "Ngày kết thúc", key: "end_date", width: 15 },
      ];
      const statusMap = { 0: "Trống", 1: "Đã thuê", 2: "Đang xử lý", 3: "Bảo trì", 4: "Đã xóa" };

      const passThrough = new PassThrough();
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "exports", public_id: `rooms_export_${jobId}`, format: "xlsx" },
        async (error, result) => {
          if (error) {
            exportJobs.set(jobId, { ...exportJobs.get(jobId), status: "failed", error: error.message });
            return;
          }
          exportJobs.set(jobId, { ...exportJobs.get(jobId), status: "completed", progress: 100, url: result.secure_url });
        }
      );

      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: passThrough, useStyles: true });
      const worksheet = workbook.addWorksheet('Rooms');
      worksheet.columns = headers.map(h => ({ header: h.label, key: h.key, width: h.width }));

      passThrough.pipe(uploadStream);

      const dbStream = await queryBuilder.orderBy("room.id", "DESC").stream();
      let count = 0;

      dbStream.on('data', (data) => {
        count++;
        const mappedRoom = {
          master_name: data.master_name || "N/A",
          master_phone: data.master_phone || "N/A",
          master_email: data.master_email || "N/A",
          master_address: data.master_address || "N/A",
          room_number: data.room_room_number || data.room_roomNumber || "N/A",
          title: data.room_title || "N/A",
          price: data.room_price || 0,
          area: data.room_area || 0,
          capacity: data.room_capacity || 0,
          city: data.room_city || "N/A",
          district: data.room_district || "N/A",
          ward: data.room_ward || "N/A",
          location: data.room_location || "N/A",
          description: data.room_description || "N/A",
          amenities: Array.isArray(data.room_amenities) ? data.room_amenities.join(", ") :
            (typeof data.room_amenities === 'string' ? data.room_amenities : ""),
          is_trending: data.room_is_trending || data.room_isTrending ? "Có" : "Không",
          status: statusMap[data.room_status] || "N/A",
          tenant_name: data.tenant_name || "không",
          tenant_phone: data.tenant_phone || "không",
          deposit: data.contracts_deposit || 0,
          start_date: data.contracts_start_date ? new Date(data.contracts_start_date).toLocaleDateString("vi-VN") : "",
          end_date: data.contracts_end_date ? new Date(data.contracts_end_date).toLocaleDateString("vi-VN") : "",
        };
        worksheet.addRow(mappedRoom).commit();

        if (count % 100 === 0 || count === total) {
          const progress = total > 0 ? Math.min(Math.round((count / total) * 90), 90) : 50;
          exportJobs.set(jobId, { ...exportJobs.get(jobId), progress });
        }
      });
      dbStream.on('end', async () => {
        await workbook.commit();
      });
    } catch (err) {
      exportJobs.set(jobId, { ...exportJobs.get(jobId), status: "failed", error: err.message });
    }
  }

  getExportStatus(jobId) {
    return exportJobs.get(jobId);
  }

  /**
   * Nhập dữ liệu từ mảng JSON (Excel parsing từ FE)
   */
  async importRooms(rows) {
    const validationErrors = [];
    const roomRepo = AppDataSource.getRepository("Room");

    // 1. Kiểm tra trùng lặp NGAY TRONG FILE EXCEL
    const seenRoomNumbersInFile = new Set();
    rows.forEach((item, index) => {
      const rNum = item.roomNumber?.toString().trim();
      if (!rNum) return; // Bỏ qua nếu dòng này không có số phòng (DTO sẽ bắt lỗi này)

      const rowLabel = item.excelRow || (index + 1); // Của để dành nếu excelRow bị mất
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

    // NẾU CÓ LỖI -> TRẢ VỀ TOÀN BỘ LỖI NGAY TỨC THÌ
    if (validationErrors.length > 0) {
      const error = new Error("Thông tin nhập vào không hợp lệ");
      error.details = validationErrors;
      error.code = "VALIDATION_ERROR";
      throw error;
    }

    // 3. THỰC HIỆN LƯU DỮ LIỆU (Khi không còn lỗi logic)
    const queryRunner = AppDataSource.getRepository("Room").queryRunner || AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const masterCache = new Map();
      const userCache = new Map();

      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];

        // 1. Xử lý Master
        let master = masterCache.get(item.masterPhone);
        if (!master) {
          master = await queryRunner.manager.findOne("Master", { where: { phone: item.masterPhone } });
        }
        if (!master) {
          master = await queryRunner.manager.save("Master", {
            name: item.masterName,
            phone: item.masterPhone,
            email: item.masterEmail,
            address: item.masterAddress
          });
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash("123456", salt);
          await queryRunner.manager.save("Account", {
            username: item.masterPhone,
            password: hashedPassword,
            role: "master",
            masterId: master.id,
            status: "active"
          });
          masterCache.set(item.masterPhone, master);
        }

        // 2. Xử lý Tenant
        let tenant = null;
        if (item.tenantPhone) {
          tenant = userCache.get(item.tenantPhone);
          if (!tenant) {
            tenant = await queryRunner.manager.findOne("User", { where: { phone: item.tenantPhone } });
          }
          if (!tenant) {
            tenant = await queryRunner.manager.save("User", {
              name: item.tenantName || "Khách thuê",
              phone: item.tenantPhone,
              email: item.tenantEmail || null
            });
            const salt = await bcrypt.genSalt(10);
            const hashedUserPassword = await bcrypt.hash("123456", salt);
            await queryRunner.manager.save("Account", {
              username: item.tenantPhone,
              password: hashedUserPassword,
              role: "user",
              userId: tenant.id,
              status: "active"
            });
            userCache.set(item.tenantPhone, tenant);
          }
        }

        // 3. Xử lý Room
        const roomStatus = tenant ? 1 : 0;
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
          isTrending: item.isTrending,
          thumbnail: "https://res.cloudinary.com/ddcxppxll/image/upload/v1712739324/default-room_vjwf1z.jpg",
          master: master,
          status: roomStatus
        });

        // 4. Tạo Hợp đồng
        if (tenant) {
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
      }
      await queryRunner.commitTransaction();
      return { message: `Thành công! Đã nhập ${rows.length} phòng.` };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

module.exports = new RoomExcelService();
