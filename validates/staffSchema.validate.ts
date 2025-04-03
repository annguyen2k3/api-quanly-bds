import { z } from 'zod';
import { StaffMess, AuthMess } from '../constants/messages.constant';

export const staffSchemaBase = z.object({
        taikhoan: z.string().min(1, AuthMess.ACCOUNT_REQUIRED),

        matkhau: z.string().min(6, AuthMess.PASSWORD_INVALID),

        tennv: z.string()
                        .min(1, StaffMess.NAME_REQUIRED)
                        .regex(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/, StaffMess.NAME_INVALID),

        sdt: z.string().regex(/^0\d{9}$/, StaffMess.PHONENUMBER_INVALID),

        diachi: z.string().min(1, StaffMess.ADDRESS_REQUIRED),

        ngaysinh: z.string()
                            .refine((val) => {
                                const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(val);
                                if (!isValidFormat) return false;
                                
                                const date = new Date(val);
                                return !isNaN(date.getTime());
                            }, StaffMess.BIRTHDAY_INVALID)
                            .refine((val) => {
                                const birthDate = new Date(val);
                                const today = new Date();
                                return birthDate < today;
                            }, StaffMess.BIRTHDAY_INVALID),

        gioitinh: z.number().refine((val) => val === 0 || val === 1, {
            message: StaffMess.SEX_REQUIRED,
        }),

        email: z.string().email(StaffMess.EMAIL_INVALID),

        quyen: z.number().refine((val) => val === 0 || val === 1, {
            message: StaffMess.ROLE_INVALID,
        }),

        trangthai: z
            .number()
            .optional()
            .refine((val) => val === undefined || val === 0 || val === 1, {
                message: StaffMess.STATUS_INVALID,
            }),
    });

// [Admin] Cập nhật thông tin nhân viên
export const updateAdmin = staffSchemaBase.extend({
        matkhau: staffSchemaBase.shape.matkhau.optional().or(z.literal('')),
})

// Cập nhật thông tin cá nhân
export const updateMe = staffSchemaBase
        .extend({
                matkhau: staffSchemaBase.shape.matkhau.optional().or(z.literal('')),
        }).omit({
                quyen: true,
                trangthai: true
        })

// Đổi mật khẩu 
export const changePassword = z.object({
        matkhaucu: z.string().min(6, AuthMess.PASSWORD_INVALID),
        matkhaumoi: z.string().min(6, AuthMess.PASSWORD_INVALID)
})

// Đăng nhập
export const login = z.object({
        taikhoan: z.string().min(1, AuthMess.ACCOUNT_REQUIRED),
        matkhau: z.string().min(6, AuthMess.PASSWORD_INVALID)
})

