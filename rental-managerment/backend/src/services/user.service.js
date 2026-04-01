const { AppDataSource } = require("../config/db");
const { In } = require("typeorm");

class UserService {
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

  async getAllUsers() {
    const userRepo = AppDataSource.getRepository("User");
    return await userRepo.find({ relations: ["room"] });
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

  async updateUser(id, data) {
    const userRepo = AppDataSource.getRepository("User");
    const userId = parseInt(id);

    if (data.roomId) data.roomId = parseInt(data.roomId);

    await userRepo.update(userId, data);
    const updatedUser = await userRepo.findOne({
      where: { id: userId },
      relations: ["room"]
    });

    if (!updatedUser) throw new Error("Không tìm thấy người dùng để cập nhật");
    return updatedUser;
  }

  async deleteUser(id) {
    const userRepo = AppDataSource.getRepository("User");
    const contractRepo = AppDataSource.getRepository("Contract");
    const roomRepo = AppDataSource.getRepository("Room");
    const userId = parseInt(id);

    // Xử lý status phòng cho các hợp đồng active trước khi user bị CASCADE
    const activeContracts = await contractRepo.find({
      where: { userId: userId, status: "active" }
    });

    const roomIds = activeContracts.map((c) => c.roomId);

    if (roomIds.length > 0) {
      // TypeORM's update won't accept an array in the first param unless using criteria object
      await roomRepo.update({ id: In(roomIds) }, { status: "Trống" });
    }

    // PostgreSQL tự xóa Contract và Account (ON DELETE CASCADE)
    const result = await userRepo.delete(userId);
    if (result.affected === 0) throw new Error("Không tìm thấy khách thuê để xóa");

    return { message: "Đã xóa toàn bộ dữ liệu liên quan đến khách thuê và giải phóng phòng thành công!" };
  }
}

module.exports = new UserService();
