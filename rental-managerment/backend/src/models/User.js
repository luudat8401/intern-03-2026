const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên người thuê là bắt buộc"],
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Số điện thoại là bắt buộc"],
    match: [/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ (10-11 chữ số)"]
  },
  room: {
    type: String,
    required: [true, "Số phòng là bắt buộc"],
    trim: true
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);