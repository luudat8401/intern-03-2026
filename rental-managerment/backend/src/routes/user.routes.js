const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Room = require("../models/Room");
const Account = require("../models/Account");
const Contract = require("../models/Contract");

router.post("/", async (req, res) => {
  try {
    const { roomId } = req.body;
    if (roomId) {
      const roomExists = await Room.findById(roomId);
      if (!roomExists) return res.status(404).json({ error: "Phòng không tồn tại" });
    }

    const user = new User(req.body);
    await user.save();
    const populatedUser = await User.findById(user._id).populate("roomId", "roomNumber");
    console.log(`[POST] : create user`);
    res.json(populatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message)
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("roomId", "roomNumber status");
    console.log(`[GET] : get user list`);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("roomId", "roomNumber status");
    if (!user) return res.status(404).json({ error: "Người dùng không tồn tại" });
    console.log(`[GET] : get user by id`);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const activeContracts = await Contract.find({ userId: userId, status: "active" });
    const roomIds = activeContracts.map(c => c.roomId);
    if (roomIds.length > 0) {
      await Room.updateMany({ _id: { $in: roomIds } }, { status: "Trống" });
    }
    await Contract.deleteMany({ userId: userId });
    await Account.deleteOne({ userId: userId });
    await User.findByIdAndDelete(userId);

    console.log(`[DELETE] : Cascade Delete User (Rooms Reset, Contracts, Account, User Profile)`);
    res.json({ message: "Đã xóa toàn bộ dữ liệu liên quan đến khách thuê và giải phóng phòng thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("roomId", "roomNumber");
    console.log(`[PUT] : Update user`);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;