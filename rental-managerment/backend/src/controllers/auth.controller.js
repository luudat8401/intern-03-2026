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
      const { username, password } = req.body;
      const result = await authService.login(username, password);
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
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: "Xác thực Google thất bại hoặc email không hợp lệ" });
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
}

module.exports = new AuthController();
