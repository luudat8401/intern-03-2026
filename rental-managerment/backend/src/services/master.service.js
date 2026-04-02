const { AppDataSource } = require("../config/db");
const { cloudinary } = require("../config/cloudinary");

class MasterService {
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

  async createMaster(data) {
    const masterRepo = AppDataSource.getRepository("Master");
    const master = masterRepo.create(data);
    await masterRepo.save(master);
    return master;
  }

  async getMasterById(id) {
    const masterRepo = AppDataSource.getRepository("Master");
    const master = await masterRepo.findOne({ where: { id: parseInt(id) } });
    if (!master) throw new Error("Không tìm thấy chủ trọ");
    return master;
  }

  async getAllMasters() {
    const masterRepo = AppDataSource.getRepository("Master");
    return await masterRepo.find();
  }

  async updateMaster(id, data, file) {
    const masterRepo = AppDataSource.getRepository("Master");
    const masterInfo = await masterRepo.findOne({ where: { id: parseInt(id) } });
    if (!masterInfo) throw new Error("Không tìm thấy chủ trọ để cập nhật");

    if (file) {
      if (masterInfo.avatar) {
        await this.deleteImageFromCloudinary(masterInfo.avatar);
      }
      data.avatar = file.path;
    }

    await masterRepo.update(id, data);
    const updatedMaster = await masterRepo.findOne({ where: { id: parseInt(id) } });
    return updatedMaster;
  }

  async deleteMaster(id) {
    const masterRepo = AppDataSource.getRepository("Master");
    
    // Xóa rác ảnh avatar nếu có trước khi xóa bản ghi
    const masterInfo = await masterRepo.findOne({ where: { id: parseInt(id) } });
    if (masterInfo && masterInfo.avatar) {
      await this.deleteImageFromCloudinary(masterInfo.avatar);
    }

    // PostgreSQL tự động dọn rác (CASCADE) các Room, Contract, Account liên quan.
    // Và tự động SET NULL roomId cho User nhờ cấu hình EntitySchema
    const result = await masterRepo.delete(id);
    if (result.affected === 0) throw new Error("Không tìm thấy chủ trọ để xóa");
    
    return { message: "Đã xóa toàn bộ dữ liệu liên quan đến chủ trọ thành công!" };
  }
}

module.exports = new MasterService();
