/**
 * Room Seeder
 * 
 * Tạo dữ liệu mẫu cho bảng Room.
 * Sử dụng ảnh Cloudinary có sẵn (duplicate) cho tất cả các phòng.
 * 
 * Cách chạy: node src/seeders/room.seeder.js
 */

const { AppDataSource } = require("../config/db");

const THUMBNAIL_URL = "https://res.cloudinary.com/ddcxppxll/image/upload/v1775012524/rental-management-app/rooms/sldhmbbhmqjpxdrzsc6n.jpg";

const roomsData = [
  //{
  //   roomNumber: "A.101",
  //   title: "Phòng Studio tiện nghi gần chợ",
  //   price: 3500000,
  //   area: "25",
  //   capacity: 2,
  //   currentTenants: 0,
  //   status: 0,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận 1",
  //   ward: "Phường Bến Nghé",
  //   location: "12 Nguyễn Huệ",
  //   isTrending: true,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "A.102",
  //   title: "Phòng trọ thoáng mát full nội thất",
  //   price: 4000000,
  //   area: "30",
  //   capacity: 3,
  //   currentTenants: 0,
  //   status: 0,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận 1",
  //   ward: "Phường Bến Thành",
  //   location: "45 Lê Lợi",
  //   isTrending: false,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "A.103",
  //   title: "Phòng cao cấp view thành phố",
  //   price: 5500000,
  //   area: "35",
  //   capacity: 2,
  //   currentTenants: 2,
  //   status: 1,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận 3",
  //   ward: "Phường Võ Thị Sáu",
  //   location: "78 Võ Văn Tần",
  //   isTrending: true,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "B.201",
  //   title: "Phòng trọ sinh viên giá rẻ",
  //   price: 2000000,
  //   area: "18",
  //   capacity: 2,
  //   currentTenants: 1,
  //   status: 1,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận Bình Thạnh",
  //   ward: "Phường 25",
  //   location: "123 Điện Biên Phủ",
  //   isTrending: false,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "B.202",
  //   title: "Phòng mới xây ban công rộng",
  //   price: 3000000,
  //   area: "22",
  //   capacity: 2,
  //   currentTenants: 0,
  //   status: 0,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận Bình Thạnh",
  //   ward: "Phường 25",
  //   location: "125 Điện Biên Phủ",
  //   isTrending: false,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "B.203",
  //   title: "Phòng đôi tiện nghi cạnh công viên",
  //   price: 3800000,
  //   area: "28",
  //   capacity: 3,
  //   currentTenants: 0,
  //   status: 2,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận Gò Vấp",
  //   ward: "Phường 10",
  //   location: "56 Phan Văn Trị",
  //   isTrending: false,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "C.301",
  //   title: "Phòng penthouse mini tầng thượng",
  //   price: 6000000,
  //   area: "40",
  //   capacity: 4,
  //   currentTenants: 3,
  //   status: 1,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận 7",
  //   ward: "Phường Tân Phú",
  //   location: "89 Nguyễn Thị Thập",
  //   isTrending: true,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "C.302",
  //   title: "Phòng trọ gần trường đại học",
  //   price: 2500000,
  //   area: "20",
  //   capacity: 2,
  //   currentTenants: 0,
  //   status: 3,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận Thủ Đức",
  //   ward: "Phường Linh Trung",
  //   location: "34 Võ Văn Ngân",
  //   isTrending: false,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "C.303",
  //   title: "Phòng đẹp an ninh tốt",
  //   price: 3200000,
  //   area: "24",
  //   capacity: 2,
  //   currentTenants: 0,
  //   status: 0,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận Tân Bình",
  //   ward: "Phường 15",
  //   location: "67 Cộng Hòa",
  //   isTrending: false,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "D.401",
  //   title: "Phòng VIP có gác lửng",
  //   price: 4500000,
  //   area: "32",
  //   capacity: 3,
  //   currentTenants: 2,
  //   status: 1,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận Phú Nhuận",
  //   ward: "Phường 7",
  //   location: "22 Phan Xích Long",
  //   isTrending: true,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "D.402",
  //   title: "Phòng trọ sạch sẽ thoáng mát",
  //   price: 2800000,
  //   area: "20",
  //   capacity: 2,
  //   currentTenants: 0,
  //   status: 0,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận 10",
  //   ward: "Phường 12",
  //   location: "99 Lý Thường Kiệt",
  //   isTrending: false,
  //   thumbnail: THUMBNAIL_URL
  // },
  // {
  //   roomNumber: "D.403",
  //   title: "Phòng duplex thiết kế hiện đại",
  //   price: 7000000,
  //   area: "45",
  //   capacity: 4,
  //   currentTenants: 0,
  //   status: 2,
  //   city: "Thành phố Hồ Chí Minh",
  //   district: "Quận 2",
  //   ward: "Phường Thảo Điền",
  //   location: "15 Xuân Thủy",
  //   isTrending: true,
  //   thumbnail: THUMBNAIL_URL

  {
    roomNumber: "E.101",
    title: "Phòng trọ sinh viên giá rẻ bao điện nước",
    price: 1800000,
    area: "15",
    capacity: 2,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 9",
    ward: "Phường Tăng Nhơn Phú A",
    location: "12 Lê Văn Việt",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "E.102",
    title: "Phòng khép kín có cửa sổ thoáng",
    price: 2200000,
    area: "20",
    capacity: 2,
    currentTenants: 2,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 9",
    ward: "Phường Tăng Nhơn Phú A",
    location: "14 Lê Văn Việt",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "E.103",
    title: "Ký túc xá cao cấp giường tầng",
    price: 1500000,
    area: "30",
    capacity: 6,
    currentTenants: 4,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 9",
    ward: "Phường Hiệp Phú",
    location: "50 Xa Lộ Hà Nội",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "E.104",
    title: "Phòng trọ mới xây hẻm xe hơi",
    price: 3500000,
    area: "25",
    capacity: 3,
    currentTenants: 0,
    status: 3,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 9",
    ward: "Phường Phước Long B",
    location: "88 Đỗ Xuân Hợp",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "E.201",
    title: "Studio mini phong cách Hàn Quốc",
    price: 4500000,
    area: "28",
    capacity: 2,
    currentTenants: 1,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 4",
    ward: "Phường 13",
    location: "120 Bến Vân Đồn",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "E.202",
    title: "Phòng trống suốt dễ decor",
    price: 3000000,
    area: "22",
    capacity: 2,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 4",
    ward: "Phường 2",
    location: "30 Tôn Thất Thuyết",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "E.203",
    title: "Phòng có gác lửng gỗ ấm cúng",
    price: 3200000,
    area: "20",
    capacity: 3,
    currentTenants: 0,
    status: 2,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 4",
    ward: "Phường 9",
    location: "45 Hoàng Diệu",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "E.204",
    title: "Căn hộ mini 1 phòng ngủ",
    price: 5500000,
    area: "35",
    capacity: 2,
    currentTenants: 2,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 4",
    ward: "Phường 12",
    location: "10 Nguyễn Khoái",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "F.101",
    title: "Phòng giá rẻ cho người đi làm",
    price: 2500000,
    area: "18",
    capacity: 2,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 8",
    ward: "Phường 4",
    location: "202 Phạm Hùng",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "F.102",
    title: "Phòng rộng có ban công phơi đồ",
    price: 3200000,
    area: "25",
    capacity: 3,
    currentTenants: 2,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 8",
    ward: "Phường 5",
    location: "115 Tạ Quang Bửu",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "F.103",
    title: "Phòng góc 2 mặt thoáng",
    price: 3800000,
    area: "28",
    capacity: 3,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 8",
    ward: "Phường 3",
    location: "55 Âu Dương Lân",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "F.104",
    title: "Phòng VIP nội thất thông minh",
    price: 4800000,
    area: "30",
    capacity: 2,
    currentTenants: 1,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 8",
    ward: "Phường 2",
    location: "79 Dạ Nam",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "G.101",
    title: "Phòng trọ gần KCN Tân Bình",
    price: 2000000,
    area: "16",
    capacity: 2,
    currentTenants: 0,
    status: 3,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Tân Bình",
    ward: "Phường 13",
    location: "12 Trường Chinh",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "G.102",
    title: "Phòng full đồ chỉ xách vali vào ở",
    price: 4200000,
    area: "24",
    capacity: 2,
    currentTenants: 2,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Tân Bình",
    ward: "Phường 4",
    location: "34 Út Tịch",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "G.103",
    title: "Phòng đôi cho 4 người",
    price: 4000000,
    area: "32",
    capacity: 4,
    currentTenants: 0,
    status: 2,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Tân Bình",
    ward: "Phường 12",
    location: "55 Hoàng Hoa Thám",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "G.104",
    title: "Căn hộ dịch vụ cao cấp",
    price: 6500000,
    area: "40",
    capacity: 3,
    currentTenants: 1,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Tân Bình",
    ward: "Phường 2",
    location: "88 Bạch Đằng",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "H.101",
    title: "Phòng trọ yên tĩnh khu dân trí cao",
    price: 2800000,
    area: "20",
    capacity: 2,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Tân Phú",
    ward: "Phường Tân Sơn Nhì",
    location: "15 Tân Sơn Nhì",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "H.102",
    title: "Phòng có máy lạnh và tủ lạnh",
    price: 3300000,
    area: "22",
    capacity: 2,
    currentTenants: 2,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Tân Phú",
    ward: "Phường Hòa Thạnh",
    location: "29 Lũy Bán Bích",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "H.103",
    title: "Phòng siêu rộng phù hợp gia đình nhỏ",
    price: 4500000,
    area: "35",
    capacity: 4,
    currentTenants: 3,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Tân Phú",
    ward: "Phường Phú Thọ Hòa",
    location: "60 Vườn Lài",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "H.104",
    title: "Phòng gác cao đúc giả",
    price: 3000000,
    area: "24",
    capacity: 3,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Tân Phú",
    ward: "Phường Tây Thạnh",
    location: "90 Lê Trọng Tấn",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "I.201",
    title: "Phòng an ninh vân tay 2 lớp",
    price: 3600000,
    area: "25",
    capacity: 2,
    currentTenants: 1,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 11",
    ward: "Phường 5",
    location: "100 Lạc Long Quân",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "I.202",
    title: "Phòng có bếp tách biệt",
    price: 3900000,
    area: "26",
    capacity: 2,
    currentTenants: 0,
    status: 2,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 11",
    ward: "Phường 15",
    location: "45 Lý Thường Kiệt",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "I.203",
    title: "Phòng sáng sủa đón nắng ban mai",
    price: 3100000,
    area: "22",
    capacity: 2,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 11",
    ward: "Phường 8",
    location: "12 Bình Thới",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "I.204",
    title: "Phòng trọ gần Đầm Sen",
    price: 2700000,
    area: "20",
    capacity: 2,
    currentTenants: 2,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 11",
    ward: "Phường 3",
    location: "88 Hòa Bình",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "J.301",
    title: "Studio có máy giặt riêng",
    price: 4500000,
    area: "28",
    capacity: 2,
    currentTenants: 1,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 6",
    ward: "Phường 11",
    location: "20 Hậu Giang",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "J.302",
    title: "Phòng bình dân khu vực Chợ Lớn",
    price: 2200000,
    area: "18",
    capacity: 2,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 6",
    ward: "Phường 2",
    location: "50 Tháp Mười",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "J.303",
    title: "Phòng thoáng có sân phơi chung",
    price: 2800000,
    area: "22",
    capacity: 3,
    currentTenants: 2,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 6",
    ward: "Phường 10",
    location: "33 Trần Văn Kiểu",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "J.304",
    title: "Căn hộ 1PN khu dân cư Bình Phú",
    price: 5000000,
    area: "35",
    capacity: 3,
    currentTenants: 0,
    status: 3,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 6",
    ward: "Phường 10",
    location: "70 Bình Phú",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "K.401",
    title: "Phòng mới tinh 100% chưa qua sử dụng",
    price: 3500000,
    area: "24",
    capacity: 2,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 12",
    ward: "Phường Tân Chánh Hiệp",
    location: "15 Tô Ký",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "K.402",
    title: "Phòng trọ cổng rào an toàn",
    price: 2000000,
    area: "18",
    capacity: 2,
    currentTenants: 1,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 12",
    ward: "Phường Hiệp Thành",
    location: "44 Nguyễn Ảnh Thủ",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "K.403",
    title: "Phòng rộng có sân để xe hơi",
    price: 4000000,
    area: "30",
    capacity: 4,
    currentTenants: 0,
    status: 2,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 12",
    ward: "Phường Thạnh Lộc",
    location: "20 Hà Huy Giáp",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "K.404",
    title: "Phòng trọ gần công viên phần mềm",
    price: 2600000,
    area: "20",
    capacity: 2,
    currentTenants: 2,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận 12",
    ward: "Phường Tân Thới Hiệp",
    location: "102 Lê Văn Khương",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "L.501",
    title: "Phòng cao cấp liền kề Landmark 81",
    price: 7500000,
    area: "40",
    capacity: 3,
    currentTenants: 1,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Bình Thạnh",
    ward: "Phường 22",
    location: "208 Nguyễn Hữu Cảnh",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "L.502",
    title: "Phòng trọ gần ngã tư Hàng Xanh",
    price: 3200000,
    area: "22",
    capacity: 2,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Bình Thạnh",
    ward: "Phường 21",
    location: "55 Xô Viết Nghệ Tĩnh",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "L.503",
    title: "Phòng view sông Sài Gòn",
    price: 5000000,
    area: "30",
    capacity: 2,
    currentTenants: 2,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Bình Thạnh",
    ward: "Phường 27",
    location: "12 Thanh Đa",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "L.504",
    title: "Phòng trọ hẻm yên tĩnh",
    price: 2700000,
    area: "20",
    capacity: 2,
    currentTenants: 0,
    status: 3,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Bình Thạnh",
    ward: "Phường 15",
    location: "88 Bạch Đằng",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "M.601",
    title: "Phòng ban công trồng cây xanh",
    price: 3800000,
    area: "26",
    capacity: 3,
    currentTenants: 0,
    status: 0,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Gò Vấp",
    ward: "Phường 5",
    location: "20 Nguyễn Thái Sơn",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "M.602",
    title: "Phòng trọ sinh viên gần ĐH Công Nghiệp",
    price: 2300000,
    area: "18",
    capacity: 2,
    currentTenants: 2,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Gò Vấp",
    ward: "Phường 4",
    location: "15 Phạm Ngũ Lão",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "M.603",
    title: "Căn hộ dịch vụ khu Cityland",
    price: 6000000,
    area: "35",
    capacity: 3,
    currentTenants: 0,
    status: 2,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Gò Vấp",
    ward: "Phường 10",
    location: "50 Nguyễn Văn Lượng",
    isTrending: true,
    thumbnail: THUMBNAIL_URL
  },
  {
    roomNumber: "M.604",
    title: "Phòng rộng sát chợ Hạnh Thông Tây",
    price: 3500000,
    area: "25",
    capacity: 3,
    currentTenants: 3,
    status: 1,
    city: "Thành phố Hồ Chí Minh",
    district: "Quận Gò Vấp",
    ward: "Phường 11",
    location: "80 Quang Trung",
    isTrending: false,
    thumbnail: THUMBNAIL_URL
  }


];

async function seedRooms() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully.");

    const roomRepo = AppDataSource.getRepository("Room");
    const masterRepo = AppDataSource.getRepository("Master");

    // Find a Master to assign rooms to
    const master = await masterRepo.findOne({ where: {}, order: { id: "ASC" } });
    if (!master) {
      console.error("❌ Không tìm thấy Master nào trong database. Hãy tạo tài khoản Master trước.");
      process.exit(1);
    }

    console.log(`🏠 Đang seed phòng cho Master: ${master.fullName || master.id}`);

    let created = 0;
    let skipped = 0;

    for (const roomData of roomsData) {
      // Check if room already exists (by roomNumber)
      const exists = await roomRepo.findOne({ where: { roomNumber: roomData.roomNumber } });
      if (exists) {
        console.log(`⏭️  Bỏ qua phòng ${roomData.roomNumber} (đã tồn tại)`);
        skipped++;
        continue;
      }

      const room = roomRepo.create({
        ...roomData,
        masterId: master.id
      });
      await roomRepo.save(room);
      console.log(`✅ Đã tạo phòng: ${roomData.roomNumber} - ${roomData.title}`);
      created++;
    }

    console.log(`\n🎉 Seed hoàn tất! Đã tạo ${created} phòng, bỏ qua ${skipped} phòng.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi khi seed dữ liệu:", err.message);
    process.exit(1);
  }
}

seedRooms();
