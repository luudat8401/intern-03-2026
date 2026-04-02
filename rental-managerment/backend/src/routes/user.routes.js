const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { uploadCloud } = require("../config/cloudinary");
const validate = require("../middleware/validation.middleware");
const userDto = require("../dtos/user.dto");

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", uploadCloud.single("image"), validate(userDto.profileSchema), userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;