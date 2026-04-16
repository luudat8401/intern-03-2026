
const yup = require("yup");

const phoneRegExp = /^(0|84|\+84)[35789][0-9]{8}$/;
const nameRegExp = /^[\p{L}\s.':\-,()&]+$/u;
const roomNumberRegExp = /^[a-zA-Z0-9.\-/ \s]+$/;
const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;

const nullTransform = (value, originalValue) => {
  if (originalValue === "N/A" || originalValue === "" || originalValue === null || originalValue === undefined) {
    return null;
  }
  return value;
};

// Hàm xử lý định dạng ngày theo regex của người dùng
const parseDateString = (value, originalValue) => {
  if (!originalValue || originalValue === "N/A" || originalValue === "") return null;
  if (originalValue instanceof Date) return originalValue;
  if (typeof originalValue === "string") {
    const userDateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    if (!userDateRegex.test(originalValue)) {
      return new Date("invalid");
    }
    const parts = originalValue.split(/[\/\-]/);
    const [d, m, y] = parts;
    const date = new Date(y, parseInt(m) - 1, parseInt(d));
    if (date.getDate() !== parseInt(d) || date.getMonth() !== parseInt(m) - 1) {
      return new Date("invalid");
    }
    return date;
  }
  return value;
};

const importRowSchema = yup.object({
  excelRow: yup.number().required("Số dòng Excel là bắt buộc").integer(),
  masterName: yup.string().optional().trim(),
  masterPhone: yup.string().required("SĐT chủ trọ là bắt buộc").matches(phoneRegExp, "SĐT chủ trọ không hợp lệ"),
  masterEmail: yup.string().required("Email chủ trọ là bắt buộc").transform(nullTransform).lowercase().matches(emailRegExp, "Email không hợp lệ").trim(),
  masterAddress: yup.string().transform(nullTransform).nullable().trim(),

  roomNumber: yup.string().required("Số phòng là bắt buộc").matches(roomNumberRegExp, "Số phòng không hợp lệ").trim(),
  title: yup.string().required("Tiêu đề phòng là bắt buộc").trim(),
  price: yup.number().typeError("Giá phòng phải là số").required("Giá phòng là bắt buộc").positive("Giá phòng phải là số dương").max(15000000, "Giá phòng không được vượt quá 15 triệu"),
  area: yup.string().required("Diện tích là bắt buộc").trim().max(200, "Diện tích phòng trọ không được vượt quá 200m2"),
  capacity: yup.number().typeError("Sức chứa phải là số").required("Sức chứa là bắt buộc").integer().min(1),
  city: yup.string().required("Tỉnh/Thành là bắt buộc").trim(),
  district: yup.string().required("Quận/Huyện là bắt buộc").trim(),
  ward: yup.string().required("Phường/Xã là bắt buộc").trim(),
  location: yup.string().required("Địa chỉ chi tiết là bắt buộc").trim(),
  description: yup.string().transform(nullTransform).nullable().trim(),
  amenities: yup.string().transform(nullTransform).nullable().trim(),
  status: yup.string().transform(nullTransform).nullable().default("Trống"),
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
  tenantEmail: yup.string().transform(nullTransform).nullable().lowercase().matches(emailRegExp, "Email người thuê không hợp lệ"),
  deposit: yup.number().typeError("Tiền cọc phải là số").nullable().default(0),
  startDate: yup.date().transform(parseDateString).typeError("Ngày bắt đầu không đúng định dạng (dd/mm/yyyy)").nullable(),
  endDate: yup.date().transform(parseDateString).typeError("Ngày kết thúc không đúng định dạng (dd/mm/yyyy)").nullable()
    .test('is-after-start', 'Ngày kết thúc phải sau ngày bắt đầu', function (value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return true;
      return new Date(value) >= new Date(startDate);
    }),
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
        const formattedErrors = err.inner.map(e => {
          const match = e.path.match(/data\[(\d+)\]/);
          const arrayIndex = match ? parseInt(match[1]) : null;
          const rowIndex = (arrayIndex !== null && data.data[arrayIndex]) ? data.data[arrayIndex].excelRow : (arrayIndex + 1);
          return rowIndex ? `Dòng ${rowIndex}: ${e.message}` : e.message;
        });

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
