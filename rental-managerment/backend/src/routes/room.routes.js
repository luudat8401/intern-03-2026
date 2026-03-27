const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Master = require("../models/Master");
const Contract = require("../models/Contract");
const User = require("../models/User");

const { uploadCloud, cloudinary } = require("../config/cloudinary");

const deleteImageFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const arr = imageUrl.split('/');
    const uploadIndex = arr.indexOf('upload');
    if (uploadIndex !== -1) {
      const pathArr = arr.slice(uploadIndex + 2);
      const fullPath = pathArr.join('/');
      const publicId = fullPath.substring(0, fullPath.lastIndexOf('.'));

      await cloudinary.uploader.destroy(publicId);
      const time = new Date().toLocaleString();
      console.log(`${time} [Cloudinary] Đã xóa dọn rác ảnh đính kèm: ${publicId}`);
    }
  } catch (err) {
    console.error("[Cloudinary Error] Lỗi dọn rác ảnh:", err.message);
  }
};

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find().populate("masterId", "name phone");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/master/:masterId", async (req, res) => {
  try {
    const rooms = await Room.find({ masterId: req.params.masterId }).populate("masterId", "name phone");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", uploadCloud.single('image'), async (req, res) => {
  try {
    if (req.file) req.body.thumbnail = req.file.path;
    const room = new Room(req.body);
    await room.save();

    const populatedRoom = await Room.findById(room._id).populate("masterId", "name phone");
    res.json(populatedRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", uploadCloud.single('image'), async (req, res) => {
  try {
    const roomId = req.params.id;
    const roomInfo = await Room.findById(roomId);
    if (!roomInfo) return res.status(404).json({ error: "Phòng không tồn tại" });
    if (req.body.status && req.body.status !== roomInfo.status) {
      const activeContract = await Contract.findOne({
        roomId: roomId,
        status: { $in: ["active", "pending"] }
      });

      if (activeContract) {
        return res.status(400).json({
          error: `Không thể thay đổi trạng thái phòng thủ công vì phòng đang có hợp đồng ${activeContract.status === 'active' ? 'đang hiệu lực' : 'đang chờ duyệt'}.`
        });
      }
    }

    // upload hình mới 
    if (req.file) {
      // xóa ảnh cũ
      if (roomInfo.thumbnail) {
        await deleteImageFromCloudinary(roomInfo.thumbnail);
      }
      // đè link ảnh
      req.body.thumbnail = req.file.path;
    }
    const updatedRoom = await Room.findByIdAndUpdate(roomId, req.body, { new: true })
      .populate("masterId", "name phone");
    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    const roomInfo = await Room.findById(roomId);
    if (!roomInfo) return res.status(404).json({ error: "Không thể xóa. Phòng không tồn tại" });
    if (roomInfo.thumbnail) {
      await deleteImageFromCloudinary(roomInfo.thumbnail);
    }
    await Contract.deleteMany({ roomId: roomId });
    await User.updateMany({ roomId: roomId }, { roomId: null });
    await Room.findByIdAndDelete(roomId);

    console.log(`[DELETE] : Cascade Delete Room ${roomId} (Cloudinary, Contracts, Users Reset, Room)`);
    res.json({ message: "Đã xóa triệt để phòng, hợp đồng liên quan và rác ảnh thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
