import * as yup from 'yup';

export const roomSchema = yup.object({

    title: yup
        .string()
        .required("Tiêu đề là bắt buộc")
        .trim()
        .matches(/^[a-zA-ZÀ-ỹ0-9\s,.\-\!\(\)\/]*$/, "Tiêu đề không được chứa ký tự đặc biệt")
        .min(1, "Tiêu đề không được để trống")
        .max(100, "Tiêu đề không được vượt quá 100 ký tự"),
    city: yup
        .string()
        .required("Thành phố là bắt buộc")
        .trim()
        .min(1, "Thành phố không được để trống")
        .max(100, "Thành phố không được vượt quá 100 ký tự"),
    ward: yup
        .string()
        .required("Phường là bắt buộc")
        .trim()
        .min(1, "Phường không được để trống")
        .max(20, "Phường không được vượt quá 20 ký tự"),
    district: yup
        .string()
        .required("Quận là bắt buộc")
        .trim()
        .min(1, "Quận không được để trống")
        .max(100, "Quận không được vượt quá 100 ký tự"),
    location: yup
        .string()
        .required("Địa chỉ cụ thể là bắt buộc")
        .trim()
        .min(1, "Địa chỉ không được để trống")
        .max(100, "Địa chỉ không được vượt quá 100 ký tự"),
    area: yup
        .number()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable()
        .typeError("Diện tích phải là một số")
        .required("Diện tích là bắt buộc")
        .positive("Diện tích phải lớn hơn 0")
        .max(100, "Diện tích phải nhỏ hơn 100"),
    roomNumber: yup
        .string()
        .matches(/^[A-Za-z0-9.-]+$/, "Số phòng chỉ được chứa chữ, số, dấu chấm (.) hoặc gạch ngang (-)")
        .required('Số phòng là bắt buộc')
        .trim()
        .min(1, 'Số phòng không được để trống'),
    price: yup
        .number()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable()
        .typeError('Giá phòng phải là một số')
        .required('Giá thuê là bắt buộc')
        .min(1000000, "Giá thuê phải từ 1.000.000 VNĐ")
        .max(10000000, "Giá thuê tối đa 10.000.000 VNĐ")
        .positive('Giá thuê phải lớn hơn 0'),
    capacity: yup
        .number()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable()
        .typeError('Sức chứa phải là một số')
        .integer('Sức chứa phải là số nguyên')
        .required('Nhập sức chứa')
        .min(1, 'Sức chứa tối thiểu là 1 người')
        .max(8, "Sức chứa tối đa là 8 người")
        .default(2),
    currentTenants: yup
        .number()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable()
        .typeError('Số người đang ở phải là một số (VD: 0)')
        .integer('Số người đang ở phải là số nguyên')
        .required('Nhập số người đang ở')
        .min(0, 'Số người đang ở không được âm')
        .max(5, "Số người đang ở không được vượt quá sức chứa")
        .default(0)
        .test(
            'is-less-or-equal',
            'Số người đang ở không được vượt quá sức chứa',
            function (value) {
                if (value === null || value === undefined || this.parent.capacity === null || this.parent.capacity === undefined) {
                    return true;
                }
                return value <= this.parent.capacity;
            }
        ),
    status: yup
        .number()
        .oneOf(
            [0, 1, 2, 3],
            'Trạng thái phòng không hợp lệ'
        )
        .default(0),
}).required();