import * as yup from 'yup';
export const phoneRegExp = /^(0|84|\+84)[35789][0-9]{8}$/;
export const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;

export const loginSchema = yup.object({
  username: yup.
    string().
    required('Vui lòng nhập tên đăng nhập').
    trim().
    matches(/^\S+$/, 'Tên đăng nhập không được chứa khoảng trắng').
    min(6, 'Tên đăng nhập ít nhất 6 ký tự').
    max(50, 'Tên đăng nhập nhiều nhất 50 ký tự'),
  password: yup.
    string().
    required('Vui lòng nhập mật khẩu').
    trim().
    matches(/^\S+$/, 'Mật khẩu không được chứa khoảng trắng').
    min(6, 'Mật khẩu ít nhất 6 ký tự').
    max(50, 'Mật khẩu nhiều nhất 50 ký tự'),
  role: yup.string().required('Vui lòng chọn vai trò đăng nhập'),
}).required();

export const registerSchema = yup.object({
  username: yup.
    string().
    required('Vui lòng nhập tên đăng nhập').
    trim().
    matches(/^\S+$/, 'Tên đăng nhập không được chứa khoảng trắng').
    min(6, 'Tên đăng nhập ít nhất 6 ký tự').
    max(200, 'Tên đăng nhập nhiều nhất 200 ký tự'),
  password: yup.
    string().
    required('Vui lòng nhập mật khẩu').
    trim().
    matches(/^\S+$/, 'Mật khẩu không được chứa khoảng trắng').
    min(6, 'Mật khẩu ít nhất 6 ký tự').
    max(200, 'Mật khẩu nhiều nhất 200 ký tự'),
  confirmPassword: yup.
    string().
    required('Vui lòng xác nhận mật khẩu').
    oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp'),
  name: yup.string().required('Họ và tên không được để trống').trim(),
  email: yup.string().matches(emailRegExp, 'Email không hợp lệ').required('Email không được để trống').trim(),
  phone: yup.
    string().
    required('Số điện thoại không được để trống').
    matches(phoneRegExp, 'Số điện thoại không hợp lệ').
    min(10, 'Số điện thoại ít nhất 10 số'),
  role: yup.string().required('Vui lòng chọn vai trò'),
}).required();

