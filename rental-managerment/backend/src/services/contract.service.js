const { AppDataSource } = require("../config/db");

class ContractService {
  async getContracts({ role, profileId }) {
    const contractRepo = AppDataSource.getRepository("Contract");
    let query = {};
    if (role === "master") {
      query.masterId = parseInt(profileId);
    } else if (role === "user") {
      query.userId = parseInt(profileId);
    }

    return await contractRepo.find({
      where: query,
      relations: ["user", "room", "master"]
    });
  }

  async createContract(data, { profileId }) {
    const contractRepo = AppDataSource.getRepository("Contract");
    const roomRepo = AppDataSource.getRepository("Room");
    
    const roomId = parseInt(data.roomId);
    const room = await roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new Error("Phòng không tồn tại");

    if (room.status !== "Trống") {
      throw new Error("Phòng này không thể đăng ký thuê lúc này!");
    }

    data.userId = parseInt(profileId);
    data.roomId = roomId;
    data.masterId = room.masterId;
    data.status = 0; // 0: pending

    const contract = contractRepo.create(data);
    const savedContract = await contractRepo.save(contract);

    await roomRepo.update(roomId, { status: 2 }); // Giả sử 2 là "Đang xử lý" (hoặc giữ nguyên nếu bạn dùng 0/1)

    return await contractRepo.findOne({
      where: { id: savedContract.id },
      relations: ["user", "room", "master"]
    });
  }

  async updateContract(id, data, { role, profileId }) {
    const contractRepo = AppDataSource.getRepository("Contract");
    const roomRepo = AppDataSource.getRepository("Room");
    const userRepo = AppDataSource.getRepository("User");

    const contractId = parseInt(id);
    const contract = await contractRepo.findOne({ where: { id: contractId } });
    if (!contract) throw new Error("Hợp đồng không tồn tại");

    if (role === "user") {
      if (contract.userId !== parseInt(profileId)) {
        throw new Error("Bạn không có quyền sửa hợp đồng này!");
      }
      if (contract.status !== 0) {
        throw new Error("Hợp đồng đã được duyệt hoặc từ chối, không thể sửa nội dung!");
      }

      delete data.status;
      delete data.masterId;
      delete data.userId;

      await contractRepo.update(contractId, data);
      return await contractRepo.findOne({
        where: { id: contractId },
        relations: ["user", "room"]
      });
    }

    if (role === "master") {
      if (contract.masterId !== parseInt(profileId)) {
        throw new Error("Bạn không có quyền xử lý hợp đồng này!");
      }

      const oldStatus = contract.status;
      const newStatus = data.status;

      await contractRepo.update(contractId, data);
      const updated = await contractRepo.findOne({
        where: { id: contractId },
        relations: ["user", "room", "master"]
      });

      // Logic cập nhật trạng thái phòng và người thuê dựa trên status hợp đồng
      if (newStatus === 1 && oldStatus !== 1) { // 1: active
        await roomRepo.update(updated.roomId, { status: 1 }); // 1: đã thuê
        await userRepo.update(updated.userId, { roomId: updated.roomId });
      } else if (newStatus === 3 || newStatus === 2 || newStatus === 4) { // 3: cancelled, 2: declined, 4: completed
        if (oldStatus === 1 || oldStatus === 0) {
          await roomRepo.update(updated.roomId, { status: 0 }); // 0: trống
          await userRepo.update(updated.userId, { roomId: null });
        }
      }

      return updated;
    }

    throw new Error("Quyền không hợp lệ");
  }

  async deleteContract(id, { role, profileId }) {
    const contractRepo = AppDataSource.getRepository("Contract");
    const roomRepo = AppDataSource.getRepository("Room");
    const userRepo = AppDataSource.getRepository("User");

    const contractId = parseInt(id);
    const contract = await contractRepo.findOne({ where: { id: contractId } });
    if (!contract) throw new Error("Hợp đồng không tồn tại");

    if (role === "user") {
      if (contract.userId !== parseInt(profileId)) {
        throw new Error("Bạn không có quyền xóa hợp đồng này!");
      }
      if (contract.status !== 0) {
        throw new Error("Hợp đồng đã được duyệt, không thể tự ý xóa. Vui lòng liên hệ chủ trọ.");
      }
    } else if (role === "master") {
      if (contract.masterId !== parseInt(profileId)) {
        throw new Error("Bạn không có quyền xóa hợp đồng này!");
      }
    }

    // Nếu hợp đồng đang active (đã thuê) thì phải giải phóng phòng và người thuê khi xóa
    if (contract.status === 1) { // 1: active
      await roomRepo.update(contract.roomId, { status: 0 }); // 0: trống
      await userRepo.update(contract.userId, { roomId: null });
    }

    await contractRepo.delete(contractId);
    return { message: "Đã xóa hợp đồng thành công" };
  }
}

module.exports = new ContractService();
