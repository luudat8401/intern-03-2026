import * as yup from 'yup';

export const roomSchema = yup.object({
    roomNumber: yup
        .string()
        .required('Số phòng là bắt buộc')
        .trim()
        .min(1, 'Số phòng không được để trống'),
    price: yup
        .number()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable()
        .typeError('Giá phòng phải là một số')
        .required('Giá thuê là bắt buộc')
        .positive('Giá thuê phải lớn hơn 0'),
    capacity: yup
        .number()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable()
        .typeError('Sức chứa phải là một số')
        .integer('Sức chứa phải là số nguyên')
        .required('Nhập sức chứa')
        .min(1, 'Sức chứa tối thiểu là 1 người')
        .default(2),
    currentTenants: yup
        .number()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable()
        .typeError('Số người đang ở phải là một số (VD: 0)')
        .integer('Số người đang ở phải là số nguyên')
        .required('Nhập số người đang ở')
        .min(0, 'Số người đang ở không được âm')
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
        .string()
        .oneOf(
            ['Trống', 'Đang xử lý', 'Đã thuê', 'Bảo trì'],
            'Trạng thái phòng không hợp lệ'
        )
        .default('Trống'),
}).required();