const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const { uploadCloud } = require("../config/cloudinary");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const roomDto = require("../dtos/room.dto");
const importDto = require("../dtos/import.dto");
const multer = require("multer");
const uploadMem = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.get("/", roomController.getAllRooms);

// Các route cụ thể cấp 2 phải được đặt TRƯỚC các route có tham số động như :id
router.get("/admin/all", verifyToken, checkRole(["admin"]), roomController.getAllRoomsForAdmin);
router.get("/admin/export", verifyToken, checkRole(["admin"]), roomController.exportRoomsToExcel);

router.post("/admin/export-cloudinary", verifyToken, checkRole(["admin"]), roomController.exportRoomsToCloudinary);
router.get("/admin/export-status/:jobId", verifyToken, checkRole(["admin"]), roomController.getExportStatus);
router.get("/admin/download-sample", verifyToken, checkRole(["admin"]), roomController.downloadSample);
router.post("/admin/import", verifyToken, checkRole(["admin"]), validate(importDto.validateImport), roomController.importRooms);

router.get("/master/:masterId", verifyToken, checkRole(["master", "admin"]), roomController.getRoomsByMasterId);
router.get("/trending", roomController.getTrendingRooms);
router.get("/random", roomController.getRandomRooms);

// Route động này phải nằm dưới cùng của nhóm GET để không tranh chấp với các keyword như "admin", "master"
router.get("/:id", roomController.getRoomById);
router.post("/", verifyToken, checkRole(["master"]), uploadCloud.single("image"), validate(roomDto.validateRoom), roomController.createRoom);
router.put("/:id", verifyToken, checkRole(["master", "admin"]), uploadCloud.single("image"), validate(roomDto.validateRoom), roomController.updateRoom);
router.delete("/:id", verifyToken, checkRole(["master", "admin"]), roomController.deleteRoom);

module.exports = router;