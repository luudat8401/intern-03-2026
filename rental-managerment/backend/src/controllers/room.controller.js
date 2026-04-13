const roomService = require("../services/room.service");
const roomExcelService = require("../services/room-excel.service");

class RoomController {
  async getAllRoomsForAdmin(req, res) {
    try {
      const result = await roomService.getAllRoomsForAdmin(req.query);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message || "Server error" });
    }
  }

  async exportRoomsToExcel(req, res) {
    try {
      await roomExcelService.exportRoomsToExcel(res, req.query);
    } catch (err) {
      console.error("Export Controller Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || "Export error" });
      } else {
        res.end();
      }
    }
  }

  async exportRoomsBatch(req, res) {
    try {
      await roomExcelService.exportRoomsToExcelBatch(res, req.query);
    } catch (err) {
      console.error("Batch Export Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || "Export error" });
      } else {
        res.end();
      }
    }
  }

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
      const { masterId } = req.params;
      const { page, limit, status } = req.query;
      const result = await roomService.getRoomsByMasterId(masterId, page, limit, status);
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
  async getTrendingRooms(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await roomService.getTrendingRooms(page, limit);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // --- ASYNC CLOUD EXCEL EXPORT (GOOGLE DRIVE STYLE) ---

  async exportRoomsToCloudinary(req, res) {
    try {
      const jobId = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      roomExcelService.exportRoomsToCloudinary(jobId, req.query);
      res.json({ success: true, jobId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getExportStatus(req, res) {
    try {
      const status = roomExcelService.getExportStatus(req.params.jobId);
      if (!status) {
        return res.status(404).json({ error: "Job không tồn tại" });
      }
      res.json(status);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async importRooms(req, res) {
    try {
      const { data } = req.body;
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: "Dữ liệu không hợp lệ (Expect JSON Array)." });
      }
      const result = await roomExcelService.importRooms(data);
      res.json(result);
    } catch (err) {
      console.error("❌ LỖI IMPORT:", err.message);
      // Trả về định dạng lỗi chuẩn hóa cho Frontend Modal
      res.status(400).json({
        message: err.message,
        details: err.details || [err.message]
      });
    }
  }
}

module.exports = new RoomController();