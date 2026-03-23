const mongoose = require("mongoose");

const masterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên chủ trọ là bắt buộc"],
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Số điện thoại là bắt buộc"],
    match: [/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ (10-11 chữ số)"]
  },
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    match: [/^\S+@\S+\.\S+$/, "Email không đúng định dạng"],
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    required: [true, "Địa chỉ là bắt buộc"],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Master", masterSchema);
