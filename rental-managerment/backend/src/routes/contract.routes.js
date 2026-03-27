const express = require("express");
const router = express.Router();
const Contract = require("../models/Contract");
const Room = require("../models/Room");
const User = require("../models/User");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

router.get("/", async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "master") {
      query.masterId = req.user.profileId;
    } else if (req.user.role === "user") {
      query.userId = req.user.profileId;
    }

    const contracts = await Contract.find(query)
      .populate("userId", "name phone isRepresentative")
      .populate("roomId", "roomNumber price status")
      .populate("masterId", "name phone");

    console.log(`[GET] : get contract list for ${req.user.role}`);
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", checkRole(["user"]), async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Phòng không tồn tại" });

    if (room.status !== "Trống") {
      return res.status(400).json({ error: "Phòng này không thể đăng ký thuê lúc này!" });
    }
    req.body.userId = req.user.profileId;
    req.body.masterId = room.masterId;
    req.body.status = "pending";

    const contract = new Contract(req.body);
    await contract.save();

    // Cập nhật trạng thái phòng sang "Đang xử lý"
    await Room.findByIdAndUpdate(roomId, { status: "Đang xử lý" });

    const populated = await Contract.findById(contract._id)
      .populate("userId", "name phone")
      .populate("roomId", "roomNumber price status")
      .populate("masterId", "name phone");

    console.log(`[POST] : Tenant ${req.user.id} requested a contract for room ${roomId}. Room status set to "Đang xử lý".`);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: "Hợp đồng không tồn tại" });

    if (req.user.role === "user") {
      if (contract.userId.toString() !== req.user.profileId) {
        return res.status(403).json({ error: "Bạn không có quyền sửa hợp đồng này!" });
      }
      if (contract.status !== "pending") {
        return res.status(400).json({ error: "Hợp đồng đã được duyệt hoặc từ chối, không thể sửa nội dung!" });
      }

      delete req.body.status;
      delete req.body.masterId;
      delete req.body.userId;

      const updated = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate("userId", "name phone")
        .populate("roomId", "roomNumber price status");
      return res.json(updated);
    }
    if (req.user.role === "master") {
      if (contract.masterId.toString() !== req.user.profileId) {
        return res.status(403).json({ error: "Bạn không có quyền xử lý hợp đồng này!" });
      }

      const oldStatus = contract.status;
      const newStatus = req.body.status;

      const updated = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate("userId", "name phone")
        .populate("roomId", "roomNumber price status")
        .populate("masterId", "name phone");

      if (newStatus === "active" && oldStatus !== "active") {
        await Room.findByIdAndUpdate(updated.roomId._id, { status: "Đã thuê" });
        await User.findByIdAndUpdate(updated.userId._id, { roomId: updated.roomId._id });
      } else if (newStatus === "cancelled" || newStatus === "decline") {
        if (oldStatus === "active" || oldStatus === "pending") {
          await Room.findByIdAndUpdate(updated.roomId._id, { status: "Trống" });
          await User.findByIdAndUpdate(updated.userId._id, { roomId: null });
        }
      }

      console.log(`[PUT] : Master ${req.user.id} updated contract ${req.params.id} to ${newStatus}`);
      return res.json(updated);
    }

    res.status(403).json({ error: "Quyền không hợp lệ" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", checkRole(["master", "user"]), async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: "Hợp đồng không tồn tại" });
    if (req.user.role === "user") {
      if (contract.userId.toString() !== req.user.profileId) {
        return res.status(403).json({ error: "Bạn không có quyền xóa hợp đồng này!" });
      }
      if (contract.status !== "pending") {
        return res.status(400).json({ error: "Hợp đồng đã được duyệt, không thể tự ý xóa. Vui lòng liên hệ chủ trọ." });
      }
    } else if (req.user.role === "master") {
      if (contract.masterId.toString() !== req.user.profileId) {
        return res.status(403).json({ error: "Bạn không có quyền xóa hợp đồng này!" });
      }
    }
    // Nếu hợp đồng đang active (đã thuê) thì phải giải phóng phòng và người thuê
    if (contract.status === "active") {
      await Room.findByIdAndUpdate(contract.roomId, { status: "Trống" });
      await User.findByIdAndUpdate(contract.userId, { roomId: null });
    }

    await Contract.findByIdAndDelete(req.params.id);
    console.log(`[DELETE] : Role ${req.user.role} (ID: ${req.user.id}) deleted contract ${req.params.id}`);
    res.json({ message: "Đã xóa hợp đồng thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;