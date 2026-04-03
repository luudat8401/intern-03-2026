const masterService = require("../services/master.service");

class MasterController {
  async createMaster(req, res) {
    try {
      const master = await masterService.createMaster(req.body);
      this.logAction(req.method, "new master");
      res.status(201).json(master);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getMasterByIdBody(req, res) {
    try {
      const master = await masterService.getMasterById(req.body.id);
      this.logAction(req.method, "get master by id (body)");
      res.json(master);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAllMasters(req, res) {
    try {
      const masters = await masterService.getAllMasters();
      this.logAction(req.method, "get master list");
      res.json(masters);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getMasterById(req, res) {
    try {
      const master = await masterService.getMasterById(req.params.id);
      this.logAction(req.method, "get master by id");
      res.json(master);
    } catch (err) {
      res.status(err.message === "Không tìm thấy chủ trọ" ? 404 : 500).json({ error: err.message });
    }
  }

  async getDashboardStats(req, res) {
    try {
      const masterId = req.params.id; 
      const months = parseInt(req.query.months) || 6;
      const stats = await masterService.getMasterDashboardStats(masterId, months);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateMaster(req, res) {
    try {
      const updatedMaster = await masterService.updateMaster(req.params.id, req.body, req.file);
      this.logAction(req.method, "Update master");
      res.json(updatedMaster);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteMaster(req, res) {
    try {
      const result = await masterService.deleteMaster(req.params.id);
      this.logAction(req.method, "Cascade Delete Master");
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  logAction(method, action) {
    const time = new Date().toLocaleString();
    console.log(`[${time}] [${method}] : ${action}`);
  }
}

module.exports = new MasterController();
