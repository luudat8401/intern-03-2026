const { AppDataSource } = require("../config/db");
const exportService = require("./export.service");

class RoomExportService {
  /**
   * Xuất danh sách phòng ra Excel (Dạng Stream cho file lớn)
   */
  async exportRoomsToExcel(res, query) {
    const roomRepo = AppDataSource.getRepository("Room");
    const { status, search, city, district } = query;

    const queryBuilder = roomRepo.createQueryBuilder("room")
      .leftJoinAndSelect("room.master", "master")
      .leftJoinAndSelect("room.contracts", "contracts", "contracts.status = :activeStatus", { activeStatus: 1 })
      .leftJoinAndSelect("contracts.user", "tenant");

    if (status && status !== 'all') {
      queryBuilder.andWhere("room.status = :status", { status: parseInt(status) });
    }
    if (city && city !== 'Chọn Tỉnh/Thành') {
      queryBuilder.andWhere("room.city = :city", { city });
    }
    if (district && district !== 'Chọn Quận/Huyện') {
      queryBuilder.andWhere("room.district = :district", { district });
    }
    if (search) {
      queryBuilder.andWhere("(room.roomNumber ILIKE :search OR room.title ILIKE :search)", { search: `%${search}%` });
    }

    const headers = [
      { label: "Họ tên Chủ trọ", key: "master_name", width: 20 },
      { label: "SĐT Chủ trọ", key: "master_phone", width: 15 },
      { label: "Email Chủ trọ", key: "master_email", width: 25 },
      { label: "Địa chỉ Chủ trọ", key: "master_address", width: 30 },
      { label: "Số phòng", key: "room_number", width: 15 },
      { label: "Tiêu đề", key: "title", width: 30 },
      { label: "Giá thuê", key: "price", width: 15 },
      { label: "Diện tích", key: "area", width: 15 },
      { label: "Sức chứa", key: "capacity", width: 15 },
      { label: "Tỉnh/Thành", key: "city", width: 20 },
      { label: "Quận/Huyện", key: "district", width: 20 },
      { label: "Phường/Xã", key: "ward", width: 20 },
      { label: "Địa chỉ chi tiết", key: "location", width: 50 },
      { label: "Mô tả", key: "description", width: 40 },
      { label: "Tiện ích", key: "amenities", width: 30 },
      { label: "Nổi bật", key: "is_trending", width: 10 },
      { label: "Trạng thái", key: "status", width: 15 },
      { label: "Họ tên người thuê", key: "tenant_name", width: 20 },
      { label: "SĐT người thuê", key: "tenant_phone", width: 15 },
      { label: "Tiền cọc", key: "deposit", width: 15 },
      { label: "Ngày bắt đầu", key: "start_date", width: 15 },
      { label: "Ngày kết thúc", key: "end_date", width: 15 },
    ];

    const statusMap = { 0: "Trống", 1: "Đã thuê", 2: "Đang xử lý", 3: "Bảo trì", 4: "Đã xóa" };

    const { workbook, worksheet } = exportService.createStreamingWorkbook(
      res,
      `Danh_sach_phong_tro_${new Date().getTime()}`,
      headers
    );

    const stream = await queryBuilder.orderBy("room.id", "DESC").stream();

    return new Promise((resolve, reject) => {
      let count = 0;
      stream.on('data', (data) => {
        try {
          count++;
          const mappedRoom = {
            master_name: data.master_name || "N/A",
            master_phone: data.master_phone || "N/A",
            master_email: data.master_email || "N/A",
            master_address: data.master_address || "N/A",
            room_number: data.room_room_number || data.room_roomNumber || "N/A",
            title: data.room_title || "N/A",
            price: data.room_price || 0,
            area: data.room_area || 0,
            capacity: data.room_capacity || 0,
            city: data.room_city || "N/A",
            district: data.room_district || "N/A",
            ward: data.room_ward || "N/A",
            location: data.room_location || "N/A",
            description: data.room_description || "N/A",
            amenities: Array.isArray(data.room_amenities) ? data.room_amenities.join(", ") :
              (typeof data.room_amenities === 'string' ? data.room_amenities : ""),
            is_trending: data.room_is_trending || data.room_isTrending ? "Có" : "Không",
            status: statusMap[data.room_status] || "N/A",
            tenant_name: data.tenant_name || "không",
            tenant_phone: data.tenant_phone || "không",
            deposit: data.contracts_deposit || 0,
            start_date: data.contracts_start_date ? new Date(data.contracts_start_date).toLocaleDateString("vi-VN") : "",
            end_date: data.contracts_end_date ? new Date(data.contracts_end_date).toLocaleDateString("vi-VN") : "",
          };
          worksheet.addRow(mappedRoom).commit();
        } catch (err) {
          console.error(`Lỗi tại dòng ${count}:`, err);
        }
      });

      stream.on('end', async () => {
        await workbook.commit();
        resolve();
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = new RoomExportService();
