const ExcelJS = require('exceljs');
const path = require('path');

async function generateNewSample() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sample Import');

  // 1. Định nghĩa đúng 17 cột chuẩn
  worksheet.columns = [
    { header: 'Tên Chủ Trọ', key: 'masterName', width: 20 },
    { header: 'SĐT Chủ Trọ', key: 'masterPhone', width: 15 },
    { header: 'Email Chủ Trọ', key: 'masterEmail', width: 20 },
    { header: 'Địa chỉ Chủ Trọ', key: 'masterAddress', width: 25 },
    { header: 'Số Phòng', key: 'roomNumber', width: 12 },
    { header: 'Tiêu Đề Phòng', key: 'title', width: 30 },
    { header: 'Giá Thuê (VNĐ)', key: 'price', width: 15 },
    { header: 'Diện Tích (m2)', key: 'area', width: 15 },
    { header: 'Sức Chứa', key: 'capacity', width: 12 },
    { header: 'Tỉnh/Thành', key: 'city', width: 20 },
    { header: 'Quận/Huyện', key: 'district', width: 20 },
    { header: 'Phường/Xã', key: 'ward', width: 20 },
    { header: 'Địa Chỉ Chi Tiết', key: 'location', width: 30 },
    { header: 'Mô Tả', key: 'description', width: 30 },
    { header: 'Tên Người Thuê', key: 'userName', width: 20 },
    { header: 'SĐT Người Thuê', key: 'userPhone', width: 15 },
    { header: 'Địa Chỉ Người Thuê', key: 'userAddress', width: 25 }
  ];

  // 2. Thêm dữ liệu mẫu MỚI hoàn toàn (Xóa bỏ code dữ liệu cũ)
  const sampleData = [
    {
      masterName: 'Trịnh Văn Quyết',
      masterPhone: '0912112233',
      masterEmail: 'quyet.tv@land.com',
      masterAddress: 'Vĩnh Phúc',
      roomNumber: 'FLC-001',
      title: 'Căn hộ view hồ cực đẹp',
      price: 8000000,
      area: 50,
      capacity: 4,
      city: 'Hà Nội',
      district: 'Quận Nam Từ Liêm',
      ward: 'Phường Mỹ Đình 1',
      location: 'Tòa nhà FLC Landmark',
      description: 'Nội thất sang trọng, tiện nghi đầy đủ.',
      userName: 'Đỗ Anh Dũng',
      userPhone: '0988001122',
      userAddress: 'Hà Nội'
    },
    {
      masterName: 'Trịnh Văn Quyết',
      masterPhone: '0912112233',
      masterEmail: 'quyet.tv@land.com',
      masterAddress: 'Vĩnh Phúc',
      roomNumber: 'FLC-002',
      title: 'Phòng Studio hiện đại',
      price: 6000000,
      area: 35,
      capacity: 2,
      city: 'Hà Nội',
      district: 'Quận Nam Từ Liêm',
      ward: 'Phường Mỹ Đình 1',
      location: 'Tòa nhà FLC Landmark',
      description: 'Phù hợp cho người đi làm.',
      userName: 'Trương Mỹ Lan',
      userPhone: '0344556677',
      userAddress: 'TP.HCM'
    }
  ];

  sampleData.forEach(row => worksheet.addRow(row));

  // 3. Format header
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2ecc71' } // Màu xanh lá tươi mới
  };

  // 4. Lưu file ghi đè file cũ
  const fileName = 'Sample_Import_Rooms.xlsx';
  const filePath = path.join(__dirname, fileName);
  await workbook.xlsx.writeFile(filePath);

  console.log(`\n✅ THÀNH CÔNG! File mẫu MỚI đã được tạo tại: ${filePath}`);
  console.log('Nội dung cũ đã bị xóa, đây là file mẫu 17 cột chuẩn.\n');
}

generateNewSample().catch(err => console.error('Lỗi khi tạo file mẫu:', err));
