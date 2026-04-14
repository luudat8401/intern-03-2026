const validator = require("./validator");
const storage = require("./storage");

class RoomImportService {
  /**
   * Cổng vào chính của chức năng Import
   */
  async importRooms(rows) {
    // 1. Bước Validator
    const validationErrors = await validator.validate(rows);

    if (validationErrors.length > 0) {
      const error = new Error("Thông tin nhập vào không hợp lệ");
      error.details = validationErrors;
      error.code = "VALIDATION_ERROR";
      throw error;
    }

    // 2. Bước Storage
    const count = await storage.saveRows(rows);

    return { 
      message: `Thành công! Đã nhập ${count} phòng.`,
      count 
    };
  }
}

module.exports = new RoomImportService();
