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
    const profileId = account.role === "master" ? account.master?.id : account.user?.id;
    const profileName =
      account.role === "master" && account.master
        ? account.master.name
        : account.role === "user" && account.user
          ? account.user.name
          : account.username;

    const userData = {
      id: account.id,
      username: account.username,
      role: account.role,
      name: profileName,
      profileId: profileId,
    };

    return {
      message: "Đăng nhập thành công",
      token: token,
      user: userData,
      ...userData,
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

