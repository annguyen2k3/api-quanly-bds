"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffSchema = void 0;
const zod_1 = require("zod");
exports.staffSchema = zod_1.z.object({
    taikhoan: zod_1.z.string().min(1, 'Tài khoản không được để trống'),
    matkhau: zod_1.z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
    tennv: zod_1.z.string().min(1, 'Tên nhân viên không được để trống'),
    sdt: zod_1.z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
    diachi: zod_1.z.string().min(1, 'Địa chỉ không được để trống'),
    ngaysinh: zod_1.z.string().date('Ngày sinh không hợp lệ'),
    gioitinh: zod_1.z.number().refine((val) => val === 0 || val === 1, {
        message: 'Giới tính không hợp lệ',
    }),
    email: zod_1.z.string().email('Email không hợp lệ'),
    quyen: zod_1.z.number().refine((val) => val === 0 || val === 1, {
        message: 'Quyền không hợp lệ',
    }),
});
