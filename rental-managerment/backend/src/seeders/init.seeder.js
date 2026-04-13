const { AppDataSource } = require("../config/db");
const bcrypt = require("bcryptjs");

const THUMBNAIL_URL = "https://res.cloudinary.com/ddcxppxll/image/upload/v1712739324/default-room_vjwf1z.jpg";

const roomsData = [
  { 
    roomNumber: "A.101", title: "Phòng Studio cao cấp trung tâm Q1", price: 5000000, area: "25", capacity: 2, 
    city: "Thành phố Hồ Chí Minh", district: "Quận 1", ward: "Phường Bến Nghé", location: "12 Nguyễn Huệ", 
    description: "Phòng mới, view đẹp, gần phố đi bộ, đầy đủ ánh sáng tự nhiên.", 
    isTrending: true, amenities: ["Wifi", "Điều hòa", "Tủ lạnh", "Bếp"] 
  },
  { 
    roomNumber: "A.102", title: "Phòng trọ sinh viên giá rẻ gần đại học", price: 2500000, area: "18", capacity: 2, 
    city: "Thành phố Hồ Chí Minh", district: "Quận 10", ward: "Phường 12", location: "456 Sư Vạn Hạnh", 
    description: "Khu vực an ninh, gần trạm bus, thích hợp cho 2 sinh viên ở.", 
    isTrending: false, amenities: ["Wifi", "Máy giặt", "Chỗ để xe"] 
  },
  { 
    roomNumber: "B.201", title: "Căn hộ dịch vụ Full nội thất Q7", price: 7500000, area: "35", capacity: 3, 
    city: "Thành phố Hồ Chí Minh", district: "Quận 7", ward: "Phường Tân Phong", location: "89 Nguyễn Văn Linh", 
    description: "Căn hộ cao cấp, có bảo vệ 24/7, hồ bơi và gym miễn phí.", 
    isTrending: true, amenities: ["Wifi", "Điều hòa", "Tủ lạnh", "Bếp", "Sofa", "Tivi"] 
  },
  { 
    roomNumber: "C.305", title: "Phòng trọ ban công thoáng mát Gò Vấp", price: 3200000, area: "22", capacity: 2, 
    city: "Thành phố Hồ Chí Minh", district: "Quận Gò Vấp", ward: "Phường 10", location: "123 Quang Trung", 
    description: "Ban công rộng, điện nước giá nhà nước, giờ giấc tự do.", 
    isTrending: false, amenities: ["Wifi", "Cửa sổ", "Ban công"] 
  },
  { 
    roomNumber: "D.404", title: "Phòng trọ mới xây hẻm xe hơi Bình Thạnh", price: 4000000, area: "20", capacity: 2, 
    city: "Thành phố Hồ Chí Minh", district: "Quận Bình Thạnh", ward: "Phường 25", location: "55 Điện Biên Phủ", 
    description: "Nhà mới 100%, trang thiết bị hiện đại, gần Landmark 81.", 
    isTrending: false, amenities: ["Wifi", "Điều hòa", "Gác lửng", "Hệ thống vân tay"] 
  }
];

async function seedData() {
  try {
    console.log("--- BẮT ĐẦU SEED DỮ LIỆU ---");
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const accountRepo = AppDataSource.getRepository("Account");
    const masterRepo = AppDataSource.getRepository("Master");
    const roomRepo = AppDataSource.getRepository("Room");

    // 1. Tạo Master mẫu
    console.log("1. Đang tạo Chủ trọ mẫu...");
    let master = await masterRepo.findOne({ where: { phone: "0987654321" } });
    if (!master) {
      master = await masterRepo.save({
        name: "Nguyễn Văn Chủ Nhà",
        phone: "0987654321",
        email: "master@test.com",
        address: "123 Đường Chu Văn An, Bình Thạnh"
      });
    }

    // 2. Tạo Tài khoản Admin & Master
    console.log("2. Đang tạo các tài khoản đăng nhập...");
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Tài khoản Admin
    const adminExist = await accountRepo.findOne({ where: { username: "admin" } });
    if (!adminExist) {
        await accountRepo.save({
            username: "admin",
            password: hashedPassword,
            role: "admin",
            email: "admin@test.com"
        });
    }

    // Tài khoản Master
    const masterAccExist = await accountRepo.findOne({ where: { username: "master" } });
    if (!masterAccExist) {
        await accountRepo.save({
            username: "master",
            password: hashedPassword,
            role: "master",
            masterId: master.id,
            email: "master@test.com"
        });
    }

    // 3. Tạo Phòng trọ mẫu
    console.log("3. Đang tạo danh sách phòng trọ...");
    for (const data of roomsData) {
      const roomExists = await roomRepo.findOne({ where: { roomNumber: data.roomNumber } });
      if (!roomExists) {
        const room = roomRepo.create({
          ...data,
          thumbnail: THUMBNAIL_URL,
          masterId: master.id,
          status: 0 // Còn trống
        });
        await roomRepo.save(room);
        console.log(`   - Đã tạo phòng: ${data.roomNumber}`);
      }
    }

    console.log("✅ SEED DỮ LIỆU THÀNH CÔNG!");
    console.log("   - Tài khoản admin: admin / 123456");
    console.log("   - Tài khoản master: master / 123456");

  } catch (err) {
    console.error("❌ LỖI khi seed dữ liệu:", err.message);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit();
  }
}

seedData();
