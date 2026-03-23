const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Người thuê là bắt buộc"]
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "Phòng là bắt buộc"]
  },
  price: {
    type: Number,
    required: [true, "Giá thuê là bắt buộc"]
  },
  startDate: {
    type: Date,
    required: [true, "Ngày bắt đầu là bắt buộc"]
  },
  endDate: {
    type: Date,
    required: [true, "Ngày kết thúc là bắt buộc"]
  },
  status: {
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active"
  },
  deposit: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Contract", contractSchema);
