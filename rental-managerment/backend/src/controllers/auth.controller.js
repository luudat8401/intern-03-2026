const authService = require("../services/auth.service");

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password, role } = req.body;
      const result = await authService.login(username, password, role);

      // Set token to HttpOnly Cookie
      if (result.token) {
        res.cookie('token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        const uiState = JSON.stringify(result.user);

        res.cookie('ui_state', Buffer.from(uiState).toString('base64'), { // Mã hóa Base64 cho gọn
          httpOnly: false, // Để React JS có thể đọc bằng document.cookie
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        delete result.token; // Remove from JSON payload for security
      }

      res.json(result);
    } catch (err) {
      const statusCode = err.message === "Tài khoản không tồn tại" ? 404 :
        err.message === "Mật khẩu không chính xác" ? 401 : 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async google(req, res) {
    try {
      const { credential, role } = req.body;
      const result = await authService.googleLogin(credential, role);

      // Set token to HttpOnly Cookie
      if (result.token) {
        res.cookie('token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const uiState = JSON.stringify(result.user);

        res.cookie('ui_state', Buffer.from(uiState).toString('base64'), {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        delete result.token; // Remove from JSON payload for security
      }

      res.json(result);
    } catch (err) {
      console.error("[Google Auth Error] Chi tiết lỗi:", err.message);
      if (err.stack) console.error(err.stack);
      res.status(401).json({ error: "Xác thực Google thất bại hoặc email không hợp lệ", details: err.message });
    }
  }

  async changePassword(req, res) {
    try {
      const accountId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      const result = await authService.changePassword(accountId, oldPassword, newPassword);
      res.json(result);
    } catch (err) {
      const statusCode = err.message.includes("không chính xác") ? 401 :
        err.message.includes("không tồn tại") ? 404 : 400;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async logout(req, res) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.clearCookie('ui_state', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.json({ message: "Đăng xuất thành công" });
  }
}

module.exports = new AuthController();
