import { z } from 'zod';
import { CustomerMess, RealEstateMess } from '../constants/messages.constant';

export const realEstateSchemaBase = z.object({
    loaiid: z.number().min(1, RealEstateMess.IDTYPE_INVALID),
    khid: z.number().min(1, CustomerMess.ID_REQUIRED),
    tinhtrang: z.number().min(0, RealEstateMess.STATUS_INVALID),
    dientich: z.number().min(1, RealEstateMess.SIZE_INVALID),
    dongia: z.number().min(1, RealEstateMess.SIZE_INVALID),
    masoqsdd: z.string().min(1, RealEstateMess.ASSET_CODE),
    chieudai: z.number().min(1, RealEstateMess.SIZE_INVALID),
    chieurong: z.number().min(1, RealEstateMess.SIZE_INVALID),
    huehong: z.number().min(1, RealEstateMess.ROSES_INVALID),
    tenduong: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
    thanhpho: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
    sonha: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
    quan: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED),
    phuong: z.string().min(1, RealEstateMess.ADDRESS_REQUIRED)
});