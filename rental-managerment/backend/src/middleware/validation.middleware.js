const validate = (dtoFunction) => {
  return async (req, res, next) => {
    try {
      const cleanedData = await dtoFunction(req.body);
      req.body = cleanedData;
      next();
    } catch (err) {
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Dữ liệu đầu vào không hợp lệ",
          errors: err.errors,
        });
      }

      console.error("[DTO Error] Lỗi xử lý dữ liệu đầu vào:", err.message);
      res.status(400).json({ error: "Dữ liệu gửi lên không đúng định dạng!" });
    }
  };
};

module.exports = validate;

