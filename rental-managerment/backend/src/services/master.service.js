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
    return await masterRepo.findOne({ where: { id: parseInt(id) } });
  }

  async deleteMaster(id) {
    const masterRepo = AppDataSource.getRepository("Master");
    const masterInfo = await masterRepo.findOne({ where: { id: parseInt(id) } });
    if (masterInfo && masterInfo.avatar) {
      await this.deleteImageFromCloudinary(masterInfo.avatar);
    }
    const result = await masterRepo.delete(id);
    if (result.affected === 0) throw new Error("Không tìm thấy chủ trọ để xóa");
    return { message: "Đã xóa toàn bộ dữ liệu liên quan đến chủ trọ thành công!" };
  }

  async getMasterDashboardStats(masterId, monthsRange = 6) {
    const roomRepo = AppDataSource.getRepository("Room");
    const contractRepo = AppDataSource.getRepository("Contract");
    const id = parseInt(masterId);

    // 1. Thống kê cơ bản thực tế
    const [totalRooms, vacantRooms, occupiedRooms, activeContracts] = await Promise.all([
      roomRepo.count({ where: { masterId: id } }),
      roomRepo.count({ where: { masterId: id, status: 0 } }),
      roomRepo.count({ where: { masterId: id, status: 1 } }),
      contractRepo.count({ where: { masterId: id, status: 1 } })
    ]);

    // 2. Tổng doanh thu tháng hiện tại thực tế
    const activeContractsData = await contractRepo.find({ where: { masterId: id, status: 1 } });
    const totalRevenue = activeContractsData.reduce((acc, curr) => acc + (curr.price || 0), 0);

    // 3. Hợp đồng sắp hết hạn (30 ngày)
    const now = new Date();
    const next30Days = new Date();
    next30Days.setDate(now.getDate() + 30);

    const expiringSoon = await contractRepo.createQueryBuilder("contract")
      .leftJoinAndSelect("contract.user", "user")
      .leftJoinAndSelect("contract.room", "room")
      .where("contract.masterId = :id", { id })
      .andWhere("contract.status = :status", { status: 1 })
      .andWhere("contract.endDate BETWEEN :now AND :next30", { now, next30: next30Days })
      .orderBy("contract.endDate", "ASC")
      .limit(5)
      .getMany();

    // 4. Sinh dữ liệu biểu đồ cho X tháng
    const monthlyRevenue = [];
    for (let i = monthsRange - 1; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthYear = `${d.getMonth() + 1}/${d.getFullYear()}`;
        
        monthlyRevenue.push({
            month: monthYear,
            amount: i === 0 ? totalRevenue : 0 // Tháng hiện tại hiển thị doanh thu thực
        });
    }

    return {
      stats: {
        totalRooms,
        vacantRooms,
        occupiedRooms,
        activeContracts,
        totalRevenue
      },
      expiringSoon: expiringSoon.map(c => ({
        id: c.id,
        name: c.user?.name || 'Ẩn danh',
        room: `P. ${c.room?.roomNumber || '?' }`,
        daysLeft: Math.ceil((new Date(c.endDate) - new Date()) / (1000 * 60 * 60 * 24)) + " ngày",
        endDate: c.endDate
      })),
      chartData: monthlyRevenue
    };
  }
}

module.exports = new MasterService();
