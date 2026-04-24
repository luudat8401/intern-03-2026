const yup = require("yup");

const loginSchema = yup.object({
  username: yup
    .string()
    .required("Vui lòng nhập tên đăng nhập")
    .trim()
    .matches(/^\S+$/, "Tên đăng nhập không được chứa khoảng trắng")
    .min(6, "Tên đăng nhập ít nhất 6 ký tự")
    .max(50, "Tên đăng nhập nhiều nhất 50 ký tự"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .trim()
    .matches(/^\S+$/, "Mật khẩu không được chứa khoảng trắng")
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .max(50, "Mật khẩu nhiều nhất 50 ký tự"),
  role: yup.string().oneOf(["admin", "master", "user"]).required("Vui lòng chọn vai trò")
});

const registerSchema = yup.object({
  username: yup
    .string()
    .required("Vui lòng nhập tên đăng nhập")
    .trim()
    .matches(/^\S+$/, "Tên không được chứa khoảng trắng")
    .min(6, "Tên ít nhất 6 ký tự")
    .max(200, "Tên nhiều nhất 200 ký tự"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .trim()
    .matches(/^\S+$/, "Mật khẩu không được chứa khoảng trắng")
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .max(200, "Mật khẩu nhiều nhất 200 ký tự"),
  name: yup.string().required("Vui lòng nhập họ và tên").trim(),
  email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email").trim(),
  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^[0-9]+$/, "Số điện thoại chỉ bao gồm số")
    .min(10, "Số điện thoại ít nhất 10 số"),
  role: yup
    .string()
    .oneOf(["admin", "master", "user"], "Vai trò không hợp lệ")
    .required("Vui lòng chọn vai trò"),
});

const googleSchema = yup.object({
  credential: yup.string().required("Thiếu token xác thực từ Google"),
  role: yup.string().oneOf(["admin", "master", "user"]).default("user")
});

const changePasswordSchema = yup.object({
  oldPassword: yup.string().required("Vui lòng nhập mật khẩu cũ"),
  newPassword: yup
    .string()
    .required("Vui lòng nhập mật khẩu mới")
    .min(6, "Mật khẩu mới ít nhất 6 ký tự")
    .matches(/^\S+$/, "Mật khẩu không được chứa khoảng trắng"),
});

class AuthDTO {
  static loginResponse(account, token) {
    // Fallback: Admin không có user/master profile → dùng account.id làm profileId dự phòng
    const profileId = account.role === "master"
      ? account.master?.id
      : account.user?.id || (account.role === 'admin' ? account.id : null);
    const profileData = account.role === "master" ? (account.master || {}) : (account.user || {});

    const userData = {
      ...profileData,
      accountId: account.id,
      id: profileData.id || account.id,
      username: account.username,
      role: account.role,
      profileId: profileId,
    };

    return {
      message: "Đăng nhập thành công",
      token: token,
      user: userData,
    };
  }

  static async registerRequest(data) {
    return await registerSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  }

  static async loginRequest(data) {
    return await loginSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  }

  static async googleRequest(data) {
    return await googleSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  }

  static async changePasswordRequest(data) {
    return await changePasswordSchema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  }
}

module.exports = AuthDTO;

