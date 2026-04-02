import * as yup from 'yup';

export const profileSchema = yup.object({
  name: yup
    .string()
    .required('Họ và tên không được để trống')
    .min(2, 'Họ và tên quá ngắn')
    .matches(/^[\p{L}\s]+$/u, 'Họ và tên chỉ được chứa chữ cái')
    .max(20, 'Họ và tên quá dài'),
  phone: yup
    .string()
    .required('Số điện thoại không được để trống')
    .matches(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, 'Số điện thoại không hợp lệ'),
  email: yup
    .string()
    .required('Email không được để trống')
    .matches(/^\S+@\S+\.\S+$/, 'Email không hợp lệ'),
  address: yup
    .string()
    .required('Địa chỉ không được để trống'),
  bankName: yup
    .string()
    .matches(/^\p{L}[\p{L}\s]*$/u, 'Tên ngân hàng chỉ được chứa chữ cái')
    .optional()
    .nullable(),
  bankAccountNumber: yup
    .string()
    .matches(/^[0-9]+$/, 'Số tài khoản không hợp lệ')
    .optional()
    .nullable(),
  bankAccountHolder: yup
    .string()
    .matches(/^[\p{L}\s]+$/u, 'Tên chủ tài khoản chỉ được chứa chữ cái')
    .optional()
    .nullable(),
  bankBranch: yup
    .string()
    .optional()
    .nullable(),
  oldPassword: yup.string().nullable().optional(),
  newPassword: yup
    .string()
    .nullable()
    .optional()
    .test('pass-length', 'Mật khẩu phải ít nhất 6 ký tự', val => !val || val.length >= 6),
  confirmNewPassword: yup
    .string()
    .nullable()
    .optional()
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp'),
}).required();
