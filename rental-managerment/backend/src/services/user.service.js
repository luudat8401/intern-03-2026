const { AppDataSource } = require("../config/db");
const { cloudinary } = require("../config/cloudinary");
const { In } = require("typeorm");

class UserService {
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
        console.log(`[Cloudinary] Đã xóa ảnh cũ của user: ${publicId}`);
      }
    } catch (err) {
      console.error("[Cloudinary Error] Lỗi dọn rác ảnh user:", err.message);
    }
  }

  async createUser(data) {
    const userRepo = AppDataSource.getRepository("User");
    const roomRepo = AppDataSource.getRepository("Room");

    if (data.roomId) {
      data.roomId = parseInt(data.roomId);
      const roomExists = await roomRepo.findOne({ where: { id: data.roomId } });
      if (!roomExists) throw new Error("Phòng không tồn tại");
    }

    const user = userRepo.create(data);
    const savedUser = await userRepo.save(user);

    return await userRepo.findOne({
      where: { id: savedUser.id },
      relations: ["room"]
    });
  }

  async getAllUsers(query = {}) {
    const userRepo = AppDataSource.getRepository("User");
    const { page, limit } = query;
    
    // Nếu không truyền page/limit thì trả về danh sách đầy đủ (tương thích backward) hoặc mặc định phân trang
    if (!page || !limit) {
       const users = await userRepo.find({ relations: ["room"], order: { id: "DESC" } });
       return {
         users,
         total: users.length,
         page: 1,
         limit: users.length || 10,
         totalPages: 1
       };
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const [users, total] = await userRepo.findAndCount({
      relations: ["room"],
      order: { id: "DESC" },
      skip,
      take
    });

    return {
      users,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / take)
    };
  }

  async getUserById(id) {
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["room"]
    });
    if (!user) throw new Error("Người dùng không tồn tại");
    return user;
  }

  async updateUser(id, data, file) {
    const userRepo = AppDataSource.getRepository("User");
    const userId = parseInt(id);

    const userInfo = await userRepo.findOne({ where: { id: userId } });
    if (!userInfo) throw new Error("Không tìm thấy người dùng để cập nhật");

    if (data.roomId) data.roomId = parseInt(data.roomId);

    if (file) {
      if (userInfo.avatar) {
        await this.deleteImageFromCloudinary(userInfo.avatar);
      }
      data.avatar = file.path;
    }

    await userRepo.update(userId, data);
    const updatedUser = await userRepo.findOne({
      where: { id: userId },
      relations: ["room"]
    });

    return updatedUser;
  }

  async deleteUser(id) {
    const userRepo = AppDataSource.getRepository("User");
    const contractRepo = AppDataSource.getRepository("Contract");
    const roomRepo = AppDataSource.getRepository("Room");
    const userId = parseInt(id);
    console.log(userId )

    const userInfo = await userRepo.findOne({ where: { id: userId } });
    if (userInfo && userInfo.avatar) {
      await this.deleteImageFromCloudinary(userInfo.avatar);
    }
    console.log(userInfo)
    // Xử lý status phòng cho các hợp đồng active trước khi user bị CASCADE
    const activeContracts = await contractRepo.find({
      where: { userId: userId, status: "2" }
    });
    console.log(activeContracts + "abcs")
    const roomIds = activeContracts.map((c) => c.roomId);

    if (roomIds.length > 0) {
      await roomRepo.update({ id: In(roomIds) }, { status: "Trống" });
      console.log(`[User Deletion] Đã cập nhật trạng thái phòng cho các hợp đồng active của user ID ${userId}`);
    } 

    const result = await userRepo.delete(userId);
    if (result.affected === 0) throw new Error("Không tìm thấy khách thuê để xóa");

    return { message: "Đã xóa toàn bộ dữ liệu liên quan đến khách thuê và giải phóng phòng thành công!" };
  }
}

module.exports = new UserService();
