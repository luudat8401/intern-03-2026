const { AppDataSource } = require("../config/db");
const { Not } = require("typeorm");
const { deleteImageFromCloudinary } = require("../utils/cloudinary");

class RoomService {
  /**
   * Lấy danh sách phòng cho khách hàng (Phân trang, lọc)
   */
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
      queryBuilder.where("room.status = :status", { status: 0 });
    }

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
      queryBuilder.orderBy("room.id", "DESC");
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

  /**
   * Lấy danh sách phòng của một chủ trọ cụ thể
   */
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

  /**
   * Lấy chi tiết phòng theo ID
   */
  async getRoomById(id) {
    const roomRepo = AppDataSource.getRepository("Room");
    return await roomRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["master"]
    });
  }

  /**
   * Lấy danh sách phòng gợi ý ngẫu nhiên
   */
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
      return [];
    }
  }

  /**
   * Tạo phòng mới
   */
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

  /**
   * Cập nhật thông tin phòng
   */
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
        await deleteImageFromCloudinary(roomInfo.thumbnail);
      }
      data.thumbnail = file.path;
    }

    if (data.price) data.price = parseFloat(data.price);
    if (data.area) data.area = parseFloat(data.area);
    if (data.capacity) data.capacity = parseInt(data.capacity);

    if (data.status !== undefined) data.status = parseInt(data.status);

    await roomRepo.update(roomId, data);
    return await roomRepo.findOne({
      where: { id: roomId },
      relations: ["master"]
    });
  }

  /**
   * Xóa phòng (Xóa mềm bằng cách đổi status thành 4)
   */
  async deleteRoom(id) {
    const roomRepo = AppDataSource.getRepository("Room");

    const roomId = parseInt(id);
    const roomInfo = await roomRepo.findOne({ where: { id: roomId } });
    if (!roomInfo) throw new Error("Không tìm thấy phòng để xóa");

    await roomRepo.update(roomId, { status: 4 });
    return { message: "Đã chuyển trạng thái phòng sang 'Đã xóa' thành công!" };
  }

  /**
   * Lấy danh sách phòng nổi bật
   */
  async getTrendingRooms(page, limit) {
    const roomRepo = AppDataSource.getRepository("Room");
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 8;
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const [rooms, total] = await roomRepo.findAndCount({
      where: {
        status: 0,
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

  /**
   * Lấy danh sách phòng cho Admin (Phân trang, tìm kiếm)
   */
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
}

module.exports = new RoomService();
