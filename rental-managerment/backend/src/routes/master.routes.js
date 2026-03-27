const express = require("express");
const router = express.Router();
const Master = require("../models/Master");
const Account = require("../models/Account");
const Room = require("../models/Room");
const Contract = require("../models/Contract");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const master = new Master(req.params.id);
    await master.save();
    const method = req.method
    const time = new Date().toLocaleDateString()
    console.log(`${time} [${method}] : new master`)
    res.json(master);
  } catch (err) {
    console.log("Error fetching users:", err)
    res.status(500).json({ error: "server error" })
  }
});
router.post("/get", async (req, res) => {
  try {
    console.log(req.body)
    const master = await Master.findById(req.body.id);

    const method = req.method
    const time = new Date().toLocaleDateString()
    console.log(`${time} [${method}] : get master by id`)
    res.json(master);
  } catch (err) {
    console.log("Error fetching users:", err)
    res.status(500).json({ error: "server error" })
  }
});
router.get("/", async (req, res) => {
  try {
    const masters = await Master.find();
    const method = req.method;
    const time = new Date().toLocaleDateString();
    console.log(`${time} [${method}] : get master list`);
    res.json(masters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const master = await Master.findById(req.params.id);
    if (!master) return res.status(404).json({ error: "Không tìm thấy chủ trọ" });
    const method = req.method;
    const time = new Date().toLocaleDateString();
    console.log(`${time} [${method}] : get master by id`);
    res.json(master);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const masterId = req.params.id;
    const rooms = await Room.find({ masterId: masterId });
    const roomIds = rooms.map(r => r._id);
    await Contract.deleteMany({ masterId: masterId });
    await User.updateMany({ roomId: { $in: roomIds } }, { roomId: null });
    await Room.deleteMany({ masterId: masterId });
    await Account.deleteOne({ masterId: masterId });
    await Master.findByIdAndDelete(masterId);

    const method = req.method;
    const time = new Date().toLocaleString();
    console.log(`[${time}] [${method}] : Cascade Delete Master (Contracts, Rooms, Users Reset, Account, Master Profile)`);
    res.json({ message: "Đã xóa toàn bộ dữ liệu liên quan đến chủ trọ thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updatedMaster = await Master.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const method = req.method;
    const time = new Date().toLocaleString();
    console.log(`[${time}] [${method}] : Update master`);
    res.json(updatedMaster);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;