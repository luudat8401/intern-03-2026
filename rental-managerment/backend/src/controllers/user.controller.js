const userService = require("../services/user.service");

class UserController {
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      console.log(`[POST] : create user`);
      res.status(201).json(user);
    } catch (err) {
      const statusCode = err.message === "Phòng không tồn tại" ? 404 : 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      console.log(`[GET] : get user list`);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      console.log(`[GET] : get user by id`);
      res.json(user);
    } catch (err) {
      const statusCode = err.message === "Người dùng không tồn tại" ? 404 : 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body, req.file);
      console.log(`[PUT] : Update user`);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUser(req.params.id);
      console.log(`[DELETE] : Cascade Delete User (ID: ${req.params.id})`);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
