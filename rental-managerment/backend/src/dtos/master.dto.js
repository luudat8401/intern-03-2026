const yup = require("yup");

const profileSchema = yup.object({
  name: yup
    .string()
    .required("Họ và tên không được để trống")
    .trim()
    .min(2, "Họ và tên quá ngắn")
    .max(50, "Họ và tên quá dài"),
  phone: yup
    .string()
    .required("Số điện thoại không được để trống")
    .trim()
    .matches(
      /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ"
    ),
  email: yup
    .string()
    .required("Email không được để trống")
    .trim()
    .email("Email không hợp lệ"),
  address: yup
    .string()
    .required("Địa chỉ không được để trống")
    .trim(),
  bankName: yup
    .string()
    .optional()
    .nullable()
    .trim(),
  bankAccountNumber: yup
    .string()
    .matches(/^[0-9]+$/, 'Số tài khoản không hợp lệ')
    .optional()
    .nullable()
    .trim(),
  bankAccountHolder: yup
    .string()
    .optional()
    .nullable()
    .trim(),
  bankBranch: yup
    .string()
    .optional()
    .nullable()
    .trim(),
});

class MasterDTO {
  static async profileSchema(data) {
    return await profileSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  }
}

module.exports = MasterDTO;
