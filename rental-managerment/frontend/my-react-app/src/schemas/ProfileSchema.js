import * as yup from 'yup';

// Common base fields for all user types
const baseFields = {
  name: yup
    .string()
    .required('Họ và tên không được để trống')
    .min(2, 'Họ tên quá ngắn')
    .max(50, 'Họ tên quá dài'),
  phone: yup
    .string()
    .required('Số điện thoại không được để trống')
    .matches(/^[0-9]{10}$/, 'Số điện thoại phải gồm 10 chữ số'),
  email: yup
    .string()
    .required('Email không được để trống')
    .email('Email không hợp lệ'),
  address: yup
    .string()
    .required('Địa chỉ không được để trống'),

  // Optional Password fields
  oldPassword: yup.string().nullable().optional(),
  newPassword: yup
    .string()
    .nullable()
    .optional()
    .test('min-length', 'Mật khẩu mới ít nhất 6 ký tự', val => !val || val.length >= 6),
  confirmNewPassword: yup
    .string()
    .nullable()
    .optional()
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp'),
};

// Tenant specific - just basic fields
export const tenantProfileSchema = yup.object({
  ...baseFields
}).required();

// Master specific - includes bank fields
export const masterProfileSchema = yup.object({
  ...baseFields,
  bankName: yup
    .string()
    .nullable()
    .matches(/^[a-zA-Z0-9 ]*$/, 'Tên ngân hàng không được chứa ký tự đặc biệt')
    .optional(),
  bankAccountNumber: yup
    .string()
    .nullable()
    .optional()
    .matches(/^[0-9]*$/, 'Số tài khoản chỉ bao gồm số'),
  bankAccountHolder: yup
    .string()
    .nullable()
    .matches(/^[a-zA-Z0-9 ]*$/, 'Tên chủ tài khoản không được chứa ký tự đặc biệt')
    .optional(),
  bankBranch: yup
    .string()
    .nullable()
    .optional(),
}).required();
