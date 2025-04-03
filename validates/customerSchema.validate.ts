import { z } from 'zod';
import { CustomerMess, RealEstateMess, StaffMess } from '../constants/messages.constant';

export const customerSchemaBase = z.object({
        hoten: z.string()
                .min(1, CustomerMess.NAME_REQUIRED)
                .regex(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/, CustomerMess.NAME_INVALID),

        diachi: z.string().min(1, CustomerMess.ADDRESS_REQUIRED),

        diachitt: z.string().min(1, CustomerMess.ADDRESS_REQUIRED),

        cmnd: z.string().length(12, CustomerMess.CMND_INVALID),

        ngaysinh: z.string()
                    .refine((val) => {
                        const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(val);
                        if (!isValidFormat) return false;
                        
                        const date = new Date(val);
                        return !isNaN(date.getTime());
                    }, CustomerMess.BIRTHDAY_INVALID)
                    .refine((val) => {
                        const birthDate = new Date(val);
                        const today = new Date();
                        return birthDate < today;
                    }, CustomerMess.BIRTHDAY_INVALID),

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

        mota: z.string().optional(),

        trangthai: z
            .number()
            .optional()
            .refine((val) => val === undefined || val === 0 || val === 1, {
                message: CustomerMess.STATUS_INVALID,
            }),
});

export const requestCustomerSchema = z.object({
    loaiid: z.number().min(1, RealEstateMess.IDTYPE_INVALID),
    khid: z.number().min(1, CustomerMess.ID_REQUIRED),
    vitri: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
    mota: z.string().optional(),
    giaf: z.number().min(1, RealEstateMess.PRICE_INVALID),
    giat: z.number().min(1, RealEstateMess.PRICE_INVALID),
    daif: z.number().min(1, RealEstateMess.SIZE_INVALID),
    dait: z.number().min(1, RealEstateMess.SIZE_INVALID),
    rongf: z.number().min(1, RealEstateMess.SIZE_INVALID),
    rongt: z.number().min(1, RealEstateMess.SIZE_INVALID),
}).strict();