const express = require("express");
const router = express.Router();
const Contract = require("../models/Contract");
const Room = require("../models/Room");

router.get("/", async (req, res) => {
  try {
    const contracts = await Contract.find()
      .populate("userId", "name phone isRepresentative")
      .populate("roomId", "roomNumber price status");
    console.log(`[GET] : get contract list`);
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();

    // Ma thuật Cập nhật trạng thái ngược: Ký hợp đồng phát là Phòng tự động nhảy sang "Đã thuê" 
    if (contract.roomId) {
      await Room.findByIdAndUpdate(contract.roomId, { status: "Đã thuê" });
    }

    const populated = await Contract.findById(contract._id)
      .populate("userId", "name phone")
      .populate("roomId", "roomNumber price status");

    console.log(`[POST] : create contract`);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("userId", "name phone")
      .populate("roomId", "roomNumber price status");

    if (req.body.status && (req.body.status === "cancelled" || req.body.status === "expired")) {
      await Room.findByIdAndUpdate(updated.roomId._id, { status: "Trống" });
    }

    console.log(`[PUT] : update contract`);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (contract && contract.roomId) {
      await Room.findByIdAndUpdate(contract.roomId, { status: "Trống" });
    }
    console.log(`[DELETE] : delete contract`);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
