const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Room = require("../models/Room");

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
    await User.findByIdAndDelete(req.params.id);
    console.log(`[DELETE] : Delete user`);
    res.json({ message: "Deleted successfully" });
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