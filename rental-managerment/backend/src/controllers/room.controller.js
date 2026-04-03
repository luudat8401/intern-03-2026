const roomService = require("../services/room.service");

class RoomController {
  async getAllRooms(req, res) {
    try {
      const result = await roomService.getAllRooms(req.query);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message || "Server error" });
    }
  }

  async getRoomsByMasterId(req, res) {
    try {
      const { page, limit, status } = req.query;
      const result = await roomService.getRoomsByMasterId(
        req.params.masterId,
        page,
        limit,
        status
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRoomById(req, res) {
    try {
      const room = await roomService.getRoomById(req.params.id);
      if (!room) {
        return res.status(404).json({ error: "Phòng không tồn tại" });
      }
      res.json(room);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRandomRooms(req, res) {
    try {
      const { city, excludeId } = req.query;
      const rooms = await roomService.getRandomRooms(city, excludeId);
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createRoom(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Dữ liệu đầu vào không hợp lệ",
          error: "Vui lòng cung cấp ảnh cho phòng."
        });
      }
      const room = await roomService.createRoom(req.body, req.file);
      res.status(201).json(room);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateRoom(req, res) {
    try {
      const updatedRoom = await roomService.updateRoom(req.params.id, req.body, req.file);
      res.json(updatedRoom);
    } catch (err) {
      const statusCode = err.message === "Phòng không tồn tại" ? 404 :
        err.message.includes("Không thể thay đổi trạng thái") ? 400 : 500;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async deleteRoom(req, res) {
    try {
      const result = await roomService.deleteRoom(req.params.id);
      console.log(`[DELETE] : Cascade Delete Room ${req.params.id}`);
      res.json(result);
    } catch (err) {
      res.status(err.message.includes("Không thể xóa") ? 404 : 500).json({ error: err.message });
    }
  }
}

module.exports = new RoomController();