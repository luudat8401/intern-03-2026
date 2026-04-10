const yup = require("yup");

const phoneRegExp = /^(0|84)(3|5|7|8|9)([0-9]{8,11})$/;
const nameRegExp = /^[\p{L}\s.':\-,()&]+$/u;
const roomNumberRegExp = /^[a-zA-Z0-9.\-/ \s]+$/;

const nullTransform = (value, originalValue) => {
  if (originalValue === "N/A" || originalValue === "" || originalValue === null || originalValue === undefined) {
    return null;
  }
  return value;
};

const importRowSchema = yup.object({
  masterName: yup.string().required("Tên chủ trọ là bắt buộc").matches(nameRegExp, "Tên chủ trọ không hợp lệ").trim(),
  masterPhone: yup.string().required("SĐT chủ trọ là bắt buộc").matches(phoneRegExp, "SĐT chủ trọ không hợp lệ"),
  masterEmail: yup.string().transform(nullTransform).nullable().email("Email không hợp lệ").trim(),
  masterAddress: yup.string().transform(nullTransform).nullable().trim(),

  roomNumber: yup.string().required("Số phòng là bắt buộc").matches(roomNumberRegExp, "Số phòng không hợp lệ").trim(),
  title: yup.string().required("Tiêu đề phòng là bắt buộc").trim(),
  price: yup.number().typeError("Giá phòng phải là số").required("Giá phòng là bắt buộc").positive("Giá phòng phải là số dương"),
  area: yup.string().transform(nullTransform).required("Diện tích là bắt buộc").trim(),
  capacity: yup.number().typeError("Sức chứa phải là số").required("Sức chứa là bắt buộc").integer().min(1),
  city: yup.string().required("Tỉnh/Thành là bắt buộc").trim(),
  district: yup.string().required("Quận/Huyện là bắt buộc").trim(),
  ward: yup.string().required("Phường/Xã là bắt buộc").trim(),
  location: yup.string().required("Địa chỉ chi tiết là bắt buộc").trim(),
  description: yup.string().transform(nullTransform).nullable().trim(),
  amenities: yup.string().transform(nullTransform).nullable().trim(),
  isTrending: yup.boolean().transform((value, originalValue) => {
    if (typeof originalValue === "string") {
      const v = originalValue.toLowerCase();
      if (v === "có" || v === "true" || v === "1") return true;
      return false;
    }
    return typeof originalValue === "boolean" ? originalValue : false;
  }).default(false),
});

const importSchema = yup.object({
  data: yup.array()
    .of(importRowSchema)
    .required("Dữ liệu nhập vào là bắt buộc")
    .min(1, "Danh sách nhập vào không được để trống")
    .max(100, "Chỉ cho phép nhập tối đa 100 dòng mỗi lần")
});

class ImportDTO {
  static async validateImport(data) {
    return await importSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  }
}

module.exports = ImportDTO;
