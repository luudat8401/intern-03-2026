import * as yup from "yup";

// Regex chuẩn đồng bộ với Backend
export const phoneRegExp = /^(0|84|\+84)[35789][0-9]{8}$/;
export const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/;
export const userDateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

// DTO Validation cho Import Excel tại Frontend
export const importRowSchema = yup.object({
    excelRow: yup.number().required().integer(),
    masterName: yup.string().optional().trim(),
    masterPhone: yup.string().required("SĐT chủ trọ là bắt buộc").matches(phoneRegExp, "SĐT không đúng định dạng VN"),
    masterEmail: yup.string().required("Email chủ trọ là bắt buộc").matches(emailRegExp, "Email không hợp lệ").trim(),
    masterAddress: yup.string().nullable().trim(),
    roomNumber: yup.string().required("Số phòng là bắt buộc").trim(),
    title: yup.string().required("Tiêu đề phòng là bắt buộc").trim(),
    price: yup.number().typeError("Giá phòng phải là số").required("Giá phòng là bắt buộc").positive("Giá phải dương").max(15000000, "Giá phòng không được quá 15 triệu"),
    area: yup.string().required("Diện tích là bắt buộc").trim(),
    capacity: yup.number().typeError("Sức chứa phải là số").required("Sức chứa là bắt buộc").integer().min(1).max(5),
    city: yup.string().required("Tỉnh/Thành là bắt buộc"),
    district: yup.string().required("Quận/Huyện là bắt buộc"),
    ward: yup.string().required("Phường/Xã là bắt buộc"),
    location: yup.string().required("Địa chỉ chi tiết là bắt buộc"),
    description: yup.string().nullable().trim(),
    amenities: yup.string().nullable().trim(),
    status: yup.string().nullable().default("Trống"),
    isTrending: yup.boolean().default(false),
    tenantName: yup.string().nullable().trim(),
    tenantPhone: yup.string().nullable().matches(phoneRegExp, "SĐT người thuê không hợp lệ"),
    deposit: yup.number().typeError("Tiền cọc phải là số").nullable().default(0),
    startDate: yup.string().nullable().matches(userDateRegex, "Ngày bắt đầu phải là dd/mm/yyyy"),
    endDate: yup.string().nullable().matches(userDateRegex, "Ngày kết thúc phải là dd/mm/yyyy"),
});
