const { AppDataSource } = require("../config/db");
const { cloudinary } = require("../config/cloudinary");
const { In } = require("typeorm");

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

  async getAllRooms() {
    const roomRepo = AppDataSource.getRepository("Room");
    return await roomRepo.find({ relations: ["master"] });
  }

  async getRoomsByMasterId(masterId) {
    const roomRepo = AppDataSource.getRepository("Room");
    return await roomRepo.find({
      where: { masterId: parseInt(masterId) },
      relations: ["master"]
    });
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
          { roomId, status: 1 }, // 1: active
          { roomId, status: 0 }  // 0: pending
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
