import * as yup from 'yup';

const phoneRegExp = /^(0|84|\+84)[35789][0-9]{8}$/;
const nameRegExp = /^[\p{L}\s.':\-,()&]+$/u;
const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const profileSchema = yup.object({
  name: yup
    .string()
    .required('Họ và tên không được để trống')
    .min(2, 'Họ và tên quá ngắn')
    .matches(nameRegExp, 'Họ và tên không hợp lệ')
    .max(50, 'Họ và tên quá dài'),
  phone: yup
    .string()
    .required('Số điện thoại không được để trống')
    .matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
  email: yup
    .string()
    .required('Email không được để trống')
    .matches(emailRegExp, 'Email không hợp lệ'),
  address: yup
    .string()
    .required('Địa chỉ không được để trống')
    .matches(/^[^<>]*$/, 'Địa chỉ không được chứa các ký tự < hoặc >'),
  bankName: yup
    .string()
    .matches(nameRegExp, 'Tên ngân hàng chỉ được chứa chữ cái')
    .optional()
    .nullable(),
  bankAccountNumber: yup
    .string()
    .matches(/^[0-9]{8,20}$/, 'Số tài khoản phải từ 8-20 chữ số')
    .optional()
    .nullable(),
  bankAccountHolder: yup
    .string()
    .matches(nameRegExp, 'Tên chủ tài khoản không hợp lệ')
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
