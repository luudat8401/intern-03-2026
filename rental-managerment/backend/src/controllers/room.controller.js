const roomService = require("../services/room.service");

class RoomController {
  async getAllRooms(req, res) {
    try {
      const rooms = await roomService.getAllRooms();
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async getRoomsByMasterId(req, res) {
    try {
      const rooms = await roomService.getRoomsByMasterId(req.params.masterId);
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
