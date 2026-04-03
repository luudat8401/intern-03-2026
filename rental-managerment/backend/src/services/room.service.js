const { AppDataSource } = require("../config/db");
const { cloudinary } = require("../config/cloudinary");

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

  // REFACTORED: Phân trang & Sắp xếp hoàn toàn dựa trên yêu cầu từ Frontend
  async getAllRooms(query) {
    const roomRepo = AppDataSource.getRepository("Room");
    const { page, limit, city, district, search, sort } = query;

    // Ép kiểu đảm bảo tính toán chính xác
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const queryBuilder = roomRepo.createQueryBuilder("room")
      .leftJoinAndSelect("room.master", "master")
      .where("room.status = :status", { status: 0 }); // Luôn chỉ lấy phòng trống (0)

    // Lọc theo địa lý (Backend xử lý)
    if (city && city !== 'Chọn Tỉnh/Thành') {
      queryBuilder.andWhere("room.city = :city", { city });
    }
    if (district && district !== 'Chọn Quận/Huyện') {
      queryBuilder.andWhere("room.district = :district", { district });
    }

    // Tìm kiếm (Backend xử lý)
    if (search) {
      queryBuilder.andWhere("(room.roomNumber ILIKE :search OR room.title ILIKE :search OR room.location ILIKE :search)", { search: `%${search}%` });
    }

    // SẮP XẾP (Backend xử lý theo yêu cầu từ Frontend)
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
    }

    const [rooms, total] = await queryBuilder
      .orderBy("room.id", "DESC")
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const masterWhere = { masterId: parseInt(masterId) };
    const [totalAll, occupied, vacant, pending, maintenance] = await Promise.all([
      roomRepo.count({ where: masterWhere }),
      roomRepo.count({ where: { ...masterWhere, status: 1 } }),
      roomRepo.count({ where: { ...masterWhere, status: 0 } }),
      roomRepo.count({ where: { ...masterWhere, status: 2 } }),
      roomRepo.count({ where: { ...masterWhere, status: 3 } }),
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
    if (!roomInfo) throw new Error("Không thể xóa. Phòng không tồn tại");

    if (roomInfo.thumbnail) {
      await this.deleteImageFromCloudinary(roomInfo.thumbnail);
    }
    await roomRepo.delete(roomId);

    return { message: "Đã xóa triệt để phòng, hợp đồng liên quan và rác ảnh thành công!" };
  }
}

module.exports = new RoomService();
