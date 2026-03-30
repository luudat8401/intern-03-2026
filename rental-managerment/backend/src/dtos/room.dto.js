const yup = require("yup");
const mongoose = require("mongoose");

const roomSchema = yup.object({
  roomNumber: yup
    .string()
    .required("Số phòng là bắt buộc")
    .trim()
    .min(1, "Số phòng không được để trống"),
  price: yup
    .number()
    .typeError("Giá phòng phải là một số")
    .required("Giá thuê là bắt buộc")
    .positive("Giá thuê phải lớn hơn 0"),
  capacity: yup
    .number()
    .typeError("Sức chứa phải là một số")
    .integer("Sức chứa phải là số nguyên")
    .min(1, "Sức chứa tối thiểu là 1 người")
    .default(2),
  currentTenants: yup
    .number()
    .typeError("Số người đang ở phải là một số")
    .integer("Số người đang ở phải là số nguyên")
    .min(0, "Số người đang ở không được âm")
    .default(0)
    .test(
      "is-less-or-equal",
      "Số người đang ở không được vượt quá sức chứa",
      function (value) {
        return value <= this.parent.capacity;
      }
    ),
  status: yup
    .string()
    .oneOf(
      ["Trống", "Đang xử lý", "Đã thuê", "Bảo trì"],
      "Trạng thái phòng không hợp lệ"
    )
    .default("Trống"),
  masterId: yup
    .string()
    .required("Thiếu thông tin chủ trọ")
    .test("is-valid-objectid", "Master ID không hợp lệ", (value) =>
      mongoose.Types.ObjectId.isValid(value)
    ),
});

class RoomDTO {
  static async validateRoom(data) {
    return await roomSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  }
}

module.exports = RoomDTO;
