const yup = require("yup");

const phoneRegExp = /^(0|84|\+84)[35789][0-9]{8}$/;
const nameRegExp = /^[\p{L}\s.':\-,()&]+$/u;
const roomNumberRegExp = /^[a-zA-Z0-9.\-/ \s]+$/;
const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const nullTransform = (value, originalValue) => {
  if (originalValue === "N/A" || originalValue === "" || originalValue === null || originalValue === undefined) {
    return null;
  }
  return value;
};

const importRowSchema = yup.object({
  masterName: yup.string().required("Tên chủ trọ là bắt buộc").matches(nameRegExp, "Tên chủ trọ không hợp lệ").trim(),
  masterPhone: yup.string().required("SĐT chủ trọ là bắt buộc").matches(phoneRegExp, "SĐT chủ trọ không hợp lệ"),
  masterEmail: yup.string().required("Email chủ trọ là bắt buộc").transform(nullTransform).matches(emailRegExp, "Email không hợp lệ").trim(),
  masterAddress: yup.string().transform(nullTransform).nullable().trim(),

  roomNumber: yup.string().required("Số phòng là bắt buộc").matches(roomNumberRegExp, "Số phòng không hợp lệ").trim(),
  title: yup.string().required("Tiêu đề phòng là bắt buộc").trim(),
  price: yup.number().typeError("Giá phòng phải là số").required("Giá phòng là bắt buộc").positive("Giá phòng phải là số dương").max(8000000, "Gía phòng trọ không dược vượt quá 8.000.000"),
  area: yup.string().transform(nullTransform).required("Diện tích là bắt buộc").trim().max(200, "Diện tích phòng trọ không thể quá lớn"),
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

  tenantName: yup.string().transform(nullTransform).nullable().trim(),
  tenantPhone: yup.string().transform(nullTransform).nullable().matches(phoneRegExp, "SĐT người thuê không hợp lệ"),
  tenantEmail: yup.string().transform(nullTransform).nullable().matches(emailRegExp, "Email người thuê không hợp lệ"),
  deposit: yup.number().typeError("Tiền cọc phải là số").transform((value, originalValue) => (originalValue === "" ? 0 : value)).nullable().default(0).max(15000000, "Tiền cọc của phòng trọ không được vượt quá 15 triệu"),
  startDate: yup.date().typeError("Ngày bắt đầu không đúng định dạng").transform(nullTransform).nullable(),
  endDate: yup.matches('^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$', "Định dạng ngày phải đúng").typeError("Ngày kết thúc không đúng định dạng").transform(nullTransform).nullable(),
  excelRow: yup.number().matches("^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$", "định dạng phải đúng").nullable(), // Giữ lại số dòng để báo lỗi
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
    try {
      return await importSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        // Biến đổi các lỗi của Yup thành định dạng "Dòng X: Lỗi..."
        const formattedErrors = err.inner.map(e => {
          // e.path có dạng "data[0].roomNumber"
          const match = e.path.match(/data\[(\d+)\]/);
          const arrayIndex = match ? parseInt(match[1]) : null;
          // Lấy chính xác số dòng từ excelRow mà FE đã găm vào
          const rowIndex = (arrayIndex !== null && data.data[arrayIndex]) ? data.data[arrayIndex].excelRow : (arrayIndex + 1);
          return rowIndex ? `Dòng ${rowIndex}: ${e.message}` : e.message;
        });

        // Tạo ra một Error object tùy chỉnh để Middleware/Controller có thể dùng details
        const customError = new Error("Dữ liệu nhập vào không hợp lệ");
        customError.name = "ImportValidationError";
        customError.details = formattedErrors;
        throw customError;
      }
      throw err;
    }
  }
}

module.exports = ImportDTO;
