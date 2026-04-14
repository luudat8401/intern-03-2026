import ExcelJS from 'exceljs';
import axios from 'axios';

export const generateRoomImportTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Import_Template');

    const headers = [
        "Họ tên Chủ trọ", "SĐT Chủ trọ", "Email Chủ trọ", "Địa chỉ Chủ trọ",
        "Số phòng", "Tiêu đề phòng", "Giá thuê (VNĐ)", "Diện tích (m2)",
        "Sức chứa (người)", "Tỉnh/Thành", "Quận/Huyện", "Phường/Xã",
        "Địa chỉ chi tiết", "Mô tả", "Tiện ích",
        "Nổi bật", "Trạng thái",
        "Họ tên người thuê", "SĐT người thuê", "Tiền cọc (VNĐ)",
        "Ngày bắt đầu (dd/mm/yyyy)", "Ngày kết thúc (dd/mm/yyyy)"
    ];

    worksheet.addRow(headers);

    // Thêm dòng dữ liệu mẫu (Sample Data)
    const sampleData = [
        "Nguyễn Văn A", "0912345678", "chutro@example.com", "123 Đường ABC, Quận 1, TP.HCM",
        "101", "Phòng trọ ban công thoáng mát", 3500000, "25",
        2, "Thành phố Hồ Chí Minh", "Quận 1", "Phường Bến Nghé",
        "123 Lê Lợi", "Phòng mới xây, đầy đủ tiện nghi, an ninh.", "Điều hoà, Tủ lạnh, bãi đậu xe",
        "Có", "Đã Thuê",
        "Nguyễn Văn B", "0912345678", 3500000, // Chưa có người thuê thì để trống các trường này
        "15/04/2026", "15/04/2027"
    ];
    worksheet.addRow(sampleData);

    // Styling Header

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F46E5' } // Indigo color
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // 1. Fetch dữ liệu địa chính (Dùng axios để đảm bảo fetch đủ 3 cấp)
    let locationData = [];
    try {
        const resp = await axios.get('https://provinces.open-api.vn/api/?depth=3');
        if (resp.status === 200) {
            locationData = resp.data;
        }
    } catch (err) {
        console.error("Lỗi fetch địa chính cho Excel:", err);
    }

    const dataSheet = workbook.addWorksheet('_Data');
    // Ẩn sheet data để file trông sạch sẽ (ExcelJS browser hỗ trợ hidden qua state)
    dataSheet.state = 'hidden';

    const sanitize = (name) => {
        if (!name) return 'UNKNOWN';
        // Dùng / /g để khớp chính xác với hàm SUBSTITUTE của Excel (thay từng khoảng trắng một)
        return 'LOC_' + name.replace(/ /g, '_').replace(/\(/g, '').replace(/\)/g, '');
    };

    try {
        // Đổ dữ liệu vào Sheet ẩn và đặt Named Ranges
        locationData.forEach((p, i) => {
            dataSheet.getCell(i + 1, 1).value = p.name;
        });

        if (locationData.length > 0) {
            workbook.definedNames.add(`_Data!$A$1:$A$${locationData.length}`, 'DANH_SACH_TINH');
        }

        let colIdx = 2;
        locationData.forEach(p => {
            const pKey = sanitize(p.name);
            const districts = p.districts || [];
            districts.forEach((d, i) => {
                dataSheet.getCell(i + 1, colIdx).value = d.name;
            });

            if (districts.length > 0) {
                const colLetter = dataSheet.getColumn(colIdx).letter;
                workbook.definedNames.add(`_Data!$${colLetter}$1:$${colLetter}$${districts.length}`, pKey);

                colIdx++;
                districts.forEach(d => {
                    const dKey = sanitize(d.name);
                    const wards = d.wards || [];
                    wards.forEach((w, i) => {
                        dataSheet.getCell(i + 1, colIdx).value = w.name;
                    });

                    if (wards.length > 0) {
                        const wardColLetter = dataSheet.getColumn(colIdx).letter;
                        workbook.definedNames.add(`_Data!$${wardColLetter}$1:$${wardColLetter}$${wards.length}`, dKey);
                        colIdx++;
                    }
                });
            }
        });

        // Dropdown cho Nổi bật & Trạng thái
        const fixColIdx = colIdx;
        const statusOptions = ["Trống", "Đã thuê", "Bảo trì", "Đã xóa"];
        statusOptions.forEach((s, i) => {
            dataSheet.getCell(i + 1, fixColIdx).value = s;
        });
        const statusCol = dataSheet.getColumn(fixColIdx).letter;
        workbook.definedNames.add(`_Data!$${statusCol}$1:$${statusCol}$4`, 'DANH_SACH_TRANG_THAI');

        const trendingOptions = ["Có", "Không"];
        trendingOptions.forEach((t, i) => {
            dataSheet.getCell(i + 1, fixColIdx + 1).value = t;
        });
        const trendingCol = dataSheet.getColumn(fixColIdx + 1).letter;
        workbook.definedNames.add(`_Data!$${trendingCol}$1:$${trendingCol}$2`, 'DANH_SACH_NOI_BAT');

        // Áp dụng Data Validation cho 500 dòng
        // Công thức này phải khớp 100% với hàm sanitize ở trên
        const indF = (ref) => `=INDIRECT("LOC_" & SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(${ref}," ","_"),"(",""),")",""))`;

        for (let i = 2; i <= 500; i++) {
            // Tỉnh (Cột J)
            worksheet.getCell(`J${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['DANH_SACH_TINH']
            };
            // Huyện (Cột K) - Phụ thuộc vào J
            worksheet.getCell(`K${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: [indF(`J${i}`)]
            };
            // Xã (Cột L) - Phụ thuộc vào K
            worksheet.getCell(`L${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: [indF(`K${i}`)]
            };
            // Tiện ích (Cột O) - Excel không hỗ trợ multi-select dropdown, nên dùng Tooltip hướng dẫn
            worksheet.getCell(`O${i}`).dataValidation = {
                type: 'custom',
                allowBlank: true,
                showInputMessage: true,
                formulae: ['=TRUE'], // Không bắt buộc đúng format cứng
                promptTitle: 'Danh sách Tiện ích',
                prompt: 'Nhập các tiện ích, cách nhau bởi dấu phẩy (,).\nCác tuỳ chọn: Điều hoà, Tủ lạnh, máy giặt, giường nệm, lối đi riêng, bãi đậu xe, khoá thông minh, camera an ninh, wi-fi tốc độ cao, khu vực bếp riêng, thang máy, dịch vụ vệ sinh.'
            };
            // Nổi bật (Cột P)
            worksheet.getCell(`P${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['DANH_SACH_NOI_BAT']
            };
            // Trạng thái (Cột Q)
            worksheet.getCell(`Q${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: ['DANH_SACH_TRANG_THAI']
            };
        }
    } catch (e) {
        console.error("Lỗi tạo validation Excel:", e);
    }

    // Định dạng rộng cột
    worksheet.columns.forEach(column => {
        column.width = 22;
    });

    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `File_Mau_Import_Phong_${new Date().getTime()}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
};
