const express = require("express");
const router = express.Router();
const Master = require("../models/Master");

router.post("/", async (req, res) => {
  try{
    const master = new Master(req.body);
    await master.save();
    const method = req.method
    const time = new Date().toLocaleDateString()
    console.log(`${time} [${method}] : new master` )
    res.json(master);
  } catch(err){
      console.log("Error fetching users:",err)
      res.status(500).json({error:"server error"})
  }
  
});
router.get("/", async (req, res) => {
  try {
    const masters = await Master.find();
    const method = req.method;
    const time = new Date().toLocaleDateString();
    console.log(`${time} [${method}] : get master list`);
    res.json(masters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const master = await Master.findById(req.params.id);
    if (!master) return res.status(404).json({ error: "Không tìm thấy chủ trọ" });
    const method = req.method;
    const time = new Date().toLocaleDateString();
    console.log(`${time} [${method}] : get master by id`);
    res.json(master);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Master.findByIdAndDelete(req.params.id);
    const method = req.method;
    const time = new Date().toLocaleString(); 
    console.log(`[${time}] [${method}] : Delete master`);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updatedMaster = await Master.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const method = req.method;
    const time = new Date().toLocaleString(); 
    console.log(`[${time}] [${method}] : Update master`);
    res.json(updatedMaster);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;