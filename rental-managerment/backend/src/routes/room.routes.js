const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const { uploadCloud } = require("../config/cloudinary");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const roomDto = require("../dtos/room.dto");

router.get("/", roomController.getAllRooms);
router.get("/master/:masterId", verifyToken, checkRole(["master"]), roomController.getRoomsByMasterId);
router.post("/", verifyToken, checkRole(["master"]), uploadCloud.single("image"), validate(roomDto.validateRoom), roomController.createRoom);
router.put("/:id", verifyToken, checkRole(["master", "admin"]), uploadCloud.single("image"), validate(roomDto.validateRoom), roomController.updateRoom);
router.delete("/:id", verifyToken, checkRole(["master", "admin"]), roomController.deleteRoom);

module.exports = router;