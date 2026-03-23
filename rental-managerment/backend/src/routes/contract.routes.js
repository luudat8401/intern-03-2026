const express = require("express");
const router = express.Router();
const Contract = require("../models/Contract");

// GET: Lấy danh sách hợp đồng, populate thông tin User và Room
router.get("/", async (req, res) => {
  try {
    const contracts = await Contract.find()
      .populate("userId", "name phone room")
      .populate("roomId", "roomNumber price");
    const time = new Date().toLocaleString();
    console.log(`[${time}] [GET] : get contract list`);
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Tạo hợp đồng mới
router.post("/", async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();

    // Sau khi tạo hợp đồng, populate để trả về đầy đủ thông tin
    const populated = await Contract.findById(contract._id)
      .populate("userId", "name phone room")
      .populate("roomId", "roomNumber price");

    const time = new Date().toLocaleString();
    console.log(`[${time}] [POST] : create contract`);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Cập nhật hợp đồng (ví dụ: đổi trạng thái sang expired)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("userId", "name phone room")
      .populate("roomId", "roomNumber price");
    const time = new Date().toLocaleString();
    console.log(`[${time}] [PUT] : update contract`);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Xóa hợp đồng
router.delete("/:id", async (req, res) => {
  try {
    await Contract.findByIdAndDelete(req.params.id);
    const time = new Date().toLocaleString();
    console.log(`[${time}] [DELETE] : delete contract`);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
