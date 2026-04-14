const validate = (dtoFunction) => {
  return async (req, res, next) => {
    try {
      const cleanedData = await dtoFunction(req.body);
      req.body = cleanedData;
      next();
    } catch (err) {
      if (err.name === "ValidationError" || err.name === "ImportValidationError") {
        return res.status(400).json({
          message: err.message || "Dữ liệu đầu vào không hợp lệ",
          details: err.details || err.errors,
        });
      }

      console.error("[DTO Error] Lỗi xử lý dữ liệu đầu vào:", err.message);
      res.status(400).json({ error: "Dữ liệu gửi lên không đúng định dạng!" });
    }
  };
};

module.exports = validate;

