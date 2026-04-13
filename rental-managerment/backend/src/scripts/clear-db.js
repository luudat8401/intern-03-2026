const { AppDataSource } = require("../config/db");

async function clearDatabase() {
  try {
    console.log("--- BẮT ĐẦU DỌN DẸP DATABASE ---");

    // Khởi tạo kết nối
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("[DB] Đã kết nối thành công.");
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Danh sách các bảng cần dọn dẹp theo thứ tự để tránh lỗi Foreign Key
    // Sử dụng CASCADE để xóa sạch các liên kết phụ thuộc
    const tables = ['rooms'];

    console.log(`Đang xóa dữ liệu các bảng: ${tables.join(", ")}...`);

    // Câu lệnh TRUNCATE (Dùng cho PostgreSQL)
    await queryRunner.query(`TRUNCATE TABLE ${tables.join(", ")} RESTART IDENTITY CASCADE;`);

    console.log("✅ THÀNH CÔNG: Database đã được làm trống và reset ID về 1.");

    await queryRunner.release();
  } catch (err) {
    console.error("❌ LỖI khi dọn dẹp database:", err.message);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("[DB] Đã đóng kết nối.");
    }
    process.exit();
  }
}

clearDatabase();
