const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validation.middleware");
const { verifyToken } = require("../middleware/auth.middleware");
const authDto = require("../dtos/auth.dto");

router.post("/register", validate(authDto.registerRequest), authController.register);
router.post("/login", validate(authDto.loginRequest), authController.login);
router.post("/google", validate(authDto.googleRequest), authController.google);
router.post("/change-password", verifyToken, validate(authDto.changePasswordRequest), authController.changePassword.bind(authController));

module.exports = router;
