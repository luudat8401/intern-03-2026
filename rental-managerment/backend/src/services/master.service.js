const { AppDataSource } = require("../config/db");

class MasterService {
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

  async updateMaster(id, data) {
    const masterRepo = AppDataSource.getRepository("Master");
    await masterRepo.update(id, data);
    const updatedMaster = await masterRepo.findOne({ where: { id: parseInt(id) } });
    if (!updatedMaster) throw new Error("Không tìm thấy chủ trọ để cập nhật");
    return updatedMaster;
  }

  async deleteMaster(id) {
    const masterRepo = AppDataSource.getRepository("Master");
    
    // PostgreSQL tự động dọn rác (CASCADE) các Room, Contract, Account liên quan.
    // Và tự động SET NULL roomId cho User nhờ cấu hình EntitySchema
    const result = await masterRepo.delete(id);
    if (result.affected === 0) throw new Error("Không tìm thấy chủ trọ để xóa");
    
    return { message: "Đã xóa toàn bộ dữ liệu liên quan đến chủ trọ thành công!" };
  }
}

module.exports = new MasterService();
