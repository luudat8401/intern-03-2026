const Contract = require("../models/Contract");
const Room = require("../models/Room");
const User = require("../models/User");

class ContractService {
  async getContracts({ role, profileId }) {
    let query = {};
    if (role === "master") {
      query.masterId = profileId;
    } else if (role === "user") {
      query.userId = profileId;
    }

    return await Contract.find(query)
      .populate("userId", "name phone isRepresentative")
      .populate("roomId", "roomNumber price status")
      .populate("masterId", "name phone");
  }

  async createContract(data, { profileId }) {
    const { roomId } = data;
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Phòng không tồn tại");

    if (room.status !== "Trống") {
      throw new Error("Phòng này không thể đăng ký thuê lúc này!");
    }

    data.userId = profileId;
    data.masterId = room.masterId;
    data.status = "pending";

    const contract = new Contract(data);
    await contract.save();

    await Room.findByIdAndUpdate(roomId, { status: "Đang xử lý" });

    return await Contract.findById(contract._id)
      .populate("userId", "name phone")
      .populate("roomId", "roomNumber price status")
      .populate("masterId", "name phone");
  }

  async updateContract(id, data, { role, profileId }) {
    const contract = await Contract.findById(id);
    if (!contract) throw new Error("Hợp đồng không tồn tại");

    if (role === "user") {
      if (contract.userId.toString() !== profileId) {
        throw new Error("Bạn không có quyền sửa hợp đồng này!");
      }
      if (contract.status !== "pending") {
        throw new Error("Hợp đồng đã được duyệt hoặc từ chối, không thể sửa nội dung!");
      }

      delete data.status;
      delete data.masterId;
      delete data.userId;

      return await Contract.findByIdAndUpdate(id, data, { new: true })
        .populate("userId", "name phone")
        .populate("roomId", "roomNumber price status");
    }

    if (role === "master") {
      if (contract.masterId.toString() !== profileId) {
        throw new Error("Bạn không có quyền xử lý hợp đồng này!");
      }

      const oldStatus = contract.status;
      const newStatus = data.status;

      const updated = await Contract.findByIdAndUpdate(id, data, { new: true })
        .populate("userId", "name phone")
        .populate("roomId", "roomNumber price status")
        .populate("masterId", "name phone");

      // Logic cập nhật trạng thái phòng và người thuê dựa trên status hợp đồng
      if (newStatus === "active" && oldStatus !== "active") {
        await Room.findByIdAndUpdate(updated.roomId._id, { status: "Đã thuê" });
        await User.findByIdAndUpdate(updated.userId._id, { roomId: updated.roomId._id });
      } else if (newStatus === "cancelled" || newStatus === "decline" || newStatus === "completed") {
        if (oldStatus === "active" || oldStatus === "pending") {
          await Room.findByIdAndUpdate(updated.roomId._id, { status: "Trống" });
          await User.findByIdAndUpdate(updated.userId._id, { roomId: null });
        }
      }

      return updated;
    }

    throw new Error("Quyền không hợp lệ");
  }

  async deleteContract(id, { role, profileId }) {
    const contract = await Contract.findById(id);
    if (!contract) throw new Error("Hợp đồng không tồn tại");

    if (role === "user") {
      if (contract.userId.toString() !== profileId) {
        throw new Error("Bạn không có quyền xóa hợp đồng này!");
      }
      if (contract.status !== "pending") {
        throw new Error("Hợp đồng đã được duyệt, không thể tự ý xóa. Vui lòng liên hệ chủ trọ.");
      }
    } else if (role === "master") {
      if (contract.masterId.toString() !== profileId) {
        throw new Error("Bạn không có quyền xóa hợp đồng này!");
      }
    }

    // Nếu hợp đồng đang active (đã thuê) thì phải giải phóng phòng và người thuê khi xóa
    if (contract.status === "active") {
      await Room.findByIdAndUpdate(contract.roomId, { status: "Trống" });
      await User.findByIdAndUpdate(contract.userId, { roomId: null });
    }

    await Contract.findByIdAndDelete(id);
    return { message: "Đã xóa hợp đồng thành công" };
  }
}

module.exports = new ContractService();
