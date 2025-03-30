import { z } from 'zod';
import { CustomerMess } from '../constants/messages.constant';

export const customerSchemaBase = z.object({
        hoten: z.string().min(1, CustomerMess.NAME_REQUIRED),
        diachi: z.string().min(1, CustomerMess.ADDRESS_REQUIRED),
        diachitt: z.string().min(1, CustomerMess.ADDRESS_REQUIRED),
        cmnd: z.string().length(12, CustomerMess.CMND_INVALID),
        ngaysinh: z.string().date(CustomerMess.BIRTHDAY_INVALID),
        sdt: z.string().regex(/^0\d{9}$/, CustomerMess.PHONENUMBER_INVALID),
        gioitinh: z.number().refine((val) => val === 0 || val === 1, {
            message: CustomerMess.SEX_REQUIRED,
        }),
        email: z.string().email(CustomerMess.EMAIL_INVALID),
        loaikh: z
            .number()
            .optional()
            .refine((val) => val === undefined || val === 0 || val === 1, {
                message: CustomerMess.TYPE_INVALID,
            }),
        trangthai: z
            .number()
            .optional()
            .refine((val) => val === undefined || val === 0 || val === 1, {
                message: CustomerMess.STATUS_INVALID,
            }),
    });
