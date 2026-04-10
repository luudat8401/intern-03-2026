const roomService = require("../services/room.service");

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
      await roomService.exportRoomsToExcel(res, req.query);
    } catch (err) {
      console.error("Export Controller Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: err.message || "Export error" });
      } else {
        // Nếu header đã gửi rồi (đang dở file), ta chỉ có thể kết thúc response
        res.end();
      }
    }
  }

  async exportRoomsBatch(req, res) {
    try {
      await roomService.exportRoomsToExcelBatch(res, req.query);
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

      // Kích hoạt xử lý ngầm (Không dùng await)
      roomService.exportRoomsToCloudinary(jobId, req.query);

      // Trả về jobId ngay lập tức cho FE
      res.json({ success: true, jobId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getExportStatus(req, res) {
    try {
      const status = roomService.getExportStatus(req.params.jobId);
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
      console.log("📥 NHẬN DỮ LIỆU IMPORT (Raw):", JSON.stringify(req.body, null, 2));
      const { data } = req.body;
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: "Dữ liệu không hợp lệ (Expect JSON Array)." });
      }
      const result = await roomService.importRooms(data);
      res.json(result);
    } catch (err) {
      console.error("❌ LỖI VALIDATION IMPORT:", err.errors || err.message);
      res.status(400).json({ 
        error: "Dữ liệu không hợp lệ", 
        details: err.errors || [err.message] 
      });
    }
  }
}

module.exports = new RoomController();