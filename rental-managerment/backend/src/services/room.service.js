const { AppDataSource } = require("../config/db");
const { Not } = require("typeorm");
const { cloudinary } = require("../config/cloudinary");
const { PassThrough } = require("stream");

// In-memory store for export jobs
const exportJobs = new Map();

class RoomService {
  async deleteImageFromCloudinary(imageUrl) {
    if (!imageUrl) return;
    try {
      const arr = imageUrl.split("/");
      const uploadIndex = arr.indexOf("upload");
      if (uploadIndex !== -1) {
        const pathArr = arr.slice(uploadIndex + 2);
        const fullPath = pathArr.join("/");
        const publicId = fullPath.substring(0, fullPath.lastIndexOf("."));

        await cloudinary.uploader.destroy(publicId);
        console.log(`[Cloudinary] Đã xóa ảnh: ${publicId}`);
      }
    } catch (err) {
      console.error("[Cloudinary Error] Lỗi dọn rác ảnh:", err.message);
    }
  }
  async getAllRooms(query) {
    const roomRepo = AppDataSource.getRepository("Room");
    const { page, limit, city, district, search, sort } = query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const queryBuilder = roomRepo.createQueryBuilder("room")
      .leftJoinAndSelect("room.master", "master")
      .leftJoinAndSelect("room.users", "users");

    if (query.status !== undefined && query.status !== 'all') {
      queryBuilder.where("room.status = :status", { status: parseInt(query.status) });
    } else {
      // Mặc định (hoặc khi chọn 'all'): Chỉ lấy phòng đang trống
      queryBuilder.where("room.status = :status", { status: 0 });
    }

    // Tuyệt đối không lấy phòng đã xóa mềm (status 4) cho User
    queryBuilder.andWhere("room.status != 4");
    if (city && city !== 'Chọn Tỉnh/Thành') {
      queryBuilder.andWhere("room.city = :city", { city });
    }
    if (district && district !== 'Chọn Quận/Huyện') {
      queryBuilder.andWhere("room.district = :district", { district });
    }
    if (search) {
      queryBuilder.andWhere("(room.roomNumber ILIKE :search OR room.title ILIKE :search OR room.location ILIKE :search)", { search: `%${search}%` });
    }
    if (sort === 'price_asc') {
      queryBuilder.orderBy("room.price", "ASC");
    } else if (sort === 'price_desc') {
      queryBuilder.orderBy("room.price", "DESC");
    } else {
      queryBuilder.orderBy("room.id", "DESC"); // Mặc định mới nhất trước
    }

    const [rooms, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      rooms,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / take)
    };
  }

  async getRoomsByMasterId(masterId, page, limit, status) {
    const roomRepo = AppDataSource.getRepository("Room");

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const queryBuilder = roomRepo.createQueryBuilder("room")
      .leftJoinAndSelect("room.master", "master")
      .leftJoinAndSelect("room.users", "users")
      .leftJoinAndSelect("room.contracts", "contracts", "contracts.status = :activeStatus", { activeStatus: 1 })
      .leftJoinAndSelect("contracts.user", "contractUser")
      .where("room.masterId = :masterId", { masterId: parseInt(masterId) });

    if (status !== 'all') {
      queryBuilder.andWhere("room.status = :status", { status: parseInt(status) });
    } else {
      // Luôn loại bỏ phòng đã xóa mềm (status 4) cho Master
      queryBuilder.andWhere("room.status != :deletedStatus", { deletedStatus: 4 });
    }

    const [rooms, total] = await queryBuilder
      .orderBy("room.id", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const masterWhere = { masterId: parseInt(masterId), status: Not(4) };
    const [totalAll, occupied, vacant, pending, maintenance] = await Promise.all([
      roomRepo.count({ where: masterWhere }),
      roomRepo.count({ where: { masterId: parseInt(masterId), status: 1 } }),
      roomRepo.count({ where: { masterId: parseInt(masterId), status: 0 } }),
      roomRepo.count({ where: { masterId: parseInt(masterId), status: 2 } }),
      roomRepo.count({ where: { masterId: parseInt(masterId), status: 3 } }),
    ]);

    return {
      rooms,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / take),
      stats: {
        total: totalAll,
        occupied,
        vacant,
        pending,
        maintenance
      }
    };
  }

  async getRoomById(id) {
    const roomRepo = AppDataSource.getRepository("Room");
    return await roomRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["master"]
    });
  }

  async getRandomRooms(city, excludeId) {
    try {
      const roomRepo = AppDataSource.getRepository("Room");
      const queryBuilder = roomRepo.createQueryBuilder("room")
        .leftJoinAndSelect("room.master", "master")
        .where("room.status = :status", { status: 0 })
        .andWhere("room.city = :city", { city })
        .andWhere("room.id != :excludeId", { excludeId: parseInt(excludeId) });

      const rooms = await queryBuilder
        .orderBy("RANDOM()")
        .limit(3)
        .getMany();

      return rooms;
    } catch (err) {
      console.error("[RoomService.getRandomRooms] Error:", err.message);
      return []; // Return empty instead of throwing to keep page alive
    }
  }

  async createRoom(data, file) {
    const roomRepo = AppDataSource.getRepository("Room");
    if (file) data.thumbnail = file.path;

    if (data.masterId) data.masterId = parseInt(data.masterId);
    if (data.price) data.price = parseFloat(data.price);
    if (data.area) data.area = parseFloat(data.area);
    if (data.capacity) data.capacity = parseInt(data.capacity);

    const room = roomRepo.create(data);
    const savedRoom = await roomRepo.save(room);

    return await roomRepo.findOne({
      where: { id: savedRoom.id },
      relations: ["master"]
    });
  }

  async updateRoom(id, data, file) {
    const roomRepo = AppDataSource.getRepository("Room");
    const contractRepo = AppDataSource.getRepository("Contract");

    const roomId = parseInt(id);
    const roomInfo = await roomRepo.findOne({ where: { id: roomId } });
    if (!roomInfo) throw new Error("Phòng không tồn tại");

    if (data.status !== undefined && data.status !== roomInfo.status) {
      const activeContract = await contractRepo.findOne({
        where: [
          { roomId, status: 1 },
          { roomId, status: 0 }
        ]
      });

      if (activeContract) {
        const statusText = activeContract.status === 1 ? "đang hiệu lực" : "đang chờ duyệt";
        throw new Error(`Không thể thay đổi trạng thái phòng thủ công vì đang có hợp đồng ${statusText}.`);
      }
    }

    if (file) {
      if (roomInfo.thumbnail) {
        await this.deleteImageFromCloudinary(roomInfo.thumbnail);
      }
      data.thumbnail = file.path;
    }

    if (data.price) data.price = parseFloat(data.price);
    if (data.area) data.area = parseFloat(data.area);
    if (data.capacity) data.capacity = parseInt(data.capacity);

    // FIX: Đảm bảo status được lưu dưới dạng số nếu nhảy vào đây
    if (data.status !== undefined) data.status = parseInt(data.status);

    await roomRepo.update(roomId, data);
    return await roomRepo.findOne({
      where: { id: roomId },
      relations: ["master"]
    });
  }

  async deleteRoom(id) {
    const roomRepo = AppDataSource.getRepository("Room");

    const roomId = parseInt(id);
    const roomInfo = await roomRepo.findOne({ where: { id: roomId } });
    if (!roomInfo) throw new Error("Không tìm thấy phòng để xóa");

    // SOFT DELETE: Cập nhật status thành 4 (Đã xóa) thay vì xóa bản ghi
    await roomRepo.update(roomId, { status: 4 });

    return { message: "Đã chuyển trạng thái phòng sang 'Đã xóa' thành công!" };
  }

  async getTrendingRooms(page, limit) {
    const roomRepo = AppDataSource.getRepository("Room");
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 8;
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const [rooms, total] = await roomRepo.findAndCount({
      where: {
        status: 0, // Chỉ lấy phòng trống
        isTrending: true
      },
      order: { id: "DESC" },
      skip,
      take,
      relations: ["master"]
    });

    return {
      rooms,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / take)
    };
  }
  async getAllRoomsForAdmin(query) {
    const roomRepo = AppDataSource.getRepository("Room");
    const { page, limit, status, search, city, district } = query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const queryBuilder = roomRepo.createQueryBuilder("room")
      .leftJoinAndSelect("room.master", "master")
      .leftJoinAndSelect("room.users", "users");

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

    const [rooms, total] = await queryBuilder
      .orderBy("room.id", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      rooms,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / take)
    };
  }

  async exportRoomsToExcel(res, query) {
    const roomRepo = AppDataSource.getRepository("Room");
    const { status, search, city, district } = query;
    const exportService = require("./export.service");

    const queryBuilder = roomRepo.createQueryBuilder("room")
      .leftJoinAndSelect("room.master", "master");

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
    ];

    const statusMap = { 0: "Trống", 1: "Đã thuê", 2: "Đang xử lý", 3: "Bảo trì", 4: "Đã xóa" };

    const { workbook, worksheet } = exportService.createStreamingWorkbook(
      res,
      `Danh_sach_phong_tro_${new Date().getTime()}`,
      headers
    );

    console.log("--- BẮT ĐẦU XUẤT FILE EXCEL (STREAMING) ---");
    const stream = await queryBuilder.orderBy("room.id", "DESC").stream();

    return new Promise((resolve, reject) => {
      let count = 0;
      stream.on('data', (room) => {
        try {
          count++;
          if (count === 1) console.log("Mẫu dữ liệu dòng đầu tiên:", room);

          const mappedRoom = {
            master_name: room.master_name || "N/A",
            master_phone: room.master_phone || "N/A",
            master_email: room.master_email || "N/A",
            master_address: room.master_address || "N/A",
            room_number: room.room_room_number || room.room_roomNumber || "N/A",
            title: room.room_title || "N/A",
            price: room.room_price || 0,
            area: room.room_area || 0,
            capacity: room.room_capacity || 0,
            city: room.room_city || "N/A",
            district: room.room_district || "N/A",
            ward: room.room_ward || "N/A",
            location: room.room_location || "N/A",
            description: room.room_description || "N/A",
            amenities: Array.isArray(room.room_amenities) ? room.room_amenities.join(", ") : 
                       (typeof room.room_amenities === 'string' ? room.room_amenities : ""),
            is_trending: room.room_is_trending || room.room_isTrending ? "Có" : "Không",
            status: statusMap[room.room_status] || "N/A",
          };
          worksheet.addRow(mappedRoom).commit();
        } catch (err) {
          console.error(`Lỗi tại dòng ${count}:`, err);
        }
      });

      stream.on('end', async () => {
        console.log(`--- HOÀN THÀNH: Đã xuất ${count} dòng ---`);
        await workbook.commit();
        resolve();
      });

      stream.on('error', (err) => {
        console.error("LỖI STREAM DATABASE:", err);
        reject(err);
      });
    });
  }

  // PHƯƠNG PHÁP THEO LÔ (BATCHING - LIMIT/OFFSET)
  async exportRoomsToExcelBatch(res, query) {
    const roomRepo = AppDataSource.getRepository("Room");
    const { status, search, city, district } = query;
    const exportService = require("./export.service");

    console.log("--- BẮT ĐẦU XUẤT FILE EXCEL (CÁCH THEO LÔ 10k) ---");
    const startTime = Date.now();

    const queryBuilder = roomRepo.createQueryBuilder("room")
      .leftJoinAndSelect("room.master", "master");

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
    ];
    const statusMap = { 0: "Trống", 1: "Đã thuê", 2: "Đang xử lý", 3: "Bảo trì", 4: "Đã xóa" };

    const { workbook, worksheet } = exportService.createStreamingWorkbook(res, `Batch_Export`, headers);

    while (offset < total) {
      console.log(`Đang xử lý lô: ${offset} -> ${offset + batchSize}`);
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
        }).commit();
      });

      offset += batchSize;
    }

    await workbook.commit();
    console.log(`--- XUẤT THEO LÔ XONG. Tổng thời gian: ${Date.now() - startTime}ms ---`);
  }

  // PHƯƠNG PHÁP XUẤT LÊN CLOUD (ASYNCHRONOUS - GOOGLE DRIVE STYLE)
  async exportRoomsToCloudinary(jobId, query) {
    const roomRepo = AppDataSource.getRepository("Room");
    const { status, search, city, district } = query;

    // Khởi tạo trạng thái Job
    exportJobs.set(jobId, { status: "processing", progress: 0, url: null, createdAt: new Date() });

    try {
      const queryBuilder = roomRepo.createQueryBuilder("room")
        .leftJoinAndSelect("room.master", "master")
        .select([
          "room.id", "room.roomNumber", "room.title", "room.price",
          "room.area", "room.capacity", "room.city", "room.district",
          "room.ward", "room.location", "room.description", "room.status",
          "master.name", "master.phone"
        ])
        .distinct(true); // Ngăn chặn việc nhân bản dòng dữ liệu do JOIN

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
      ];
      const statusMap = { 0: "Trống", 1: "Đã thuê", 2: "Đang xử lý", 3: "Bảo trì", 4: "Đã xóa" };

      const passThrough = new PassThrough();
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "exports", public_id: `rooms_export_${jobId}`, format: "xlsx" },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
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
        // Khi dùng stream(), dữ liệu thường được trả về dưới dạng dẹt (flattened) với tiền tố alias
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
        };
        worksheet.addRow(mappedRoom).commit();

        if (count % 100 === 0 || count === total) {
          const progress = total > 0 ? Math.min(Math.round((count / total) * 90), 90) : 50;
          exportJobs.set(jobId, { ...exportJobs.get(jobId), progress });
        }
      });
      dbStream.on('end', async () => {
        console.log(`[Stream End] Success: Processed ${count}/${total} rooms.`);
        await workbook.commit();
      });
      dbStream.on('error', (err) => {
        throw err;
      });
    } catch (err) {
      console.error("Export Async Error:", err);
      exportJobs.set(jobId, { ...exportJobs.get(jobId), status: "failed", error: err.message });
    }
  }

  // Lấy trạng thái Job xuất file
  getExportStatus(jobId) {
    return exportJobs.get(jobId);
  }

  // PHƯƠNG THỨC NHẬP DỮ LIỆU TỔNG HỢP (PHIÊN BẢN ĐƠN GIẢN - MAX 100 DÒNG)
  async importRooms(rows) {
    // 1. Chạy Transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const masterCache = new Map(); // Dùng để tránh tạo trùng Master trong cùng 1 file

      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        console.log(`[Import] Đang xử lý dòng ${i + 1}: ${item.roomNumber}`);

        // 1. Xử lý Master (Chủ trọ)
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
          masterCache.set(item.masterPhone, master);
        }

        // 2. Xử lý Room (Phòng)
        const existingRoom = await queryRunner.manager.findOne("Room", { where: { roomNumber: item.roomNumber } });
        if (existingRoom) {
          throw new Error(`Dòng ${i + 1}: Số phòng "${item.roomNumber}" đã tồn tại trên hệ thống.`);
        }

        await queryRunner.manager.save("Room", {
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
          status: 0
        });
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

module.exports = new RoomService();
