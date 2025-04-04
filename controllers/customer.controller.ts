import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { CommonMess, CustomerMess, RealEstateMess, StaffMess } from "../constants/messages.constant";
import { khach_hang, KhachHang, KhachHangCreationAttributes } from "../models/khach_hang.model";
import { Op } from "sequelize";
import { yeu_cau_khach_hang, YeuCauKHCreationAttributes } from "../models/yeu_cau_khach_hang.model";
import { loai_bds } from "../models/loai_bds.model";

// [GET] /customer/list
export const getList = async (req: Request, res: Response) => {
    try {
        const whereObject = {}

        // Find Status
        let status: number;
        const rawStatus = req.query.status;

        if (rawStatus === undefined || rawStatus === "") {
            status = 1;
        }  else {
            const parsedStatus = parseInt(rawStatus as string, 10);
            if (isNaN(parsedStatus) || ![0,1].includes(parsedStatus)) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    code: StatusCodes.BAD_REQUEST,
                    message: CustomerMess.STATUS_INVALID
                });
                return;
            }
            status = parsedStatus;
        }
        whereObject["trangthai"] = status;
        // End Find Status

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        // End Pagination

        const { rows, count } = await khach_hang.findAndCountAll({
            where: whereObject,
            limit,
            offset,
            raw: true
        });

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: rows,
            pagination: {
                currentPage: page,
                pageSize: limit,
                countRecord: count,
                totalPage: Math.ceil(count/limit)
            }
        })
      } catch (error) {
        console.log('Error in get list customer controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [GET] /customer/:khid
export const detail = async (req: Request, res: Response) => {
    try {
        const id =  parseInt(req.params.khid);

        const khachhang: KhachHang = await khach_hang.findOne({
            where: {
                khid: id
            },
            raw: true
        })

        if(!khachhang) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.ID_NOT_EXITS,
                errors: {
                    khid: CustomerMess.ID_NOT_EXITS
                }
            })
            return;
        }

        const requests = await yeu_cau_khach_hang.findAll({
            where: {
                khid: id
            }, 
            raw: true
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: {
                ...khachhang,
                requests: requests
            }
        })
      } catch (error) {
        console.log('ErrorController Detail Customer: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [POST] /customer/create 
export const create = async (req: Request, res: Response) => {
    try {
        // Check exits CMND
        const checkCMND = await khach_hang.findOne({
            where: {
                cmnd: req.body.cmnd
            }
        })
        if(checkCMND) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.CMND_EXITS,
                errors: {
                    cmnd: CustomerMess.CMND_EXITS
                }
            })
            return;
        }
        // End Check exits CMND

        // Check Exits Email
        const checkEmail = await khach_hang.findOne({
            where: {
                email: req.body.email
            }
        })
        if(checkEmail) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.EMAIL_EXITS,
                errors: {
                    email: CustomerMess.EMAIL_EXITS
                }
            })
            return;
        }
        // End Check Exits Email

        let data: KhachHangCreationAttributes = {
            nvid: res.locals.user.nvid,
            hoten: req.body.hoten,
            diachi: req.body.diachi,
            diachitt: req.body.diachitt,
            cmnd: req.body.cmnd,
            ngaysinh: req.body.ngaysinh,
            sdt: req.body.sdt,
            gioitinh: req.body.gioitinh,
            email: req.body.email,
            loaikh: req.body.loaikh,
            mota: req.body.mota??"",
        }

        const kh = await khach_hang.create(data);

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.CREATE_SUCCESS,
            data: kh.dataValues
        })
      } catch (error) {
        console.log('Error in create customer controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}

// [PUT] /customer/update/:khid
export const update = async (req: Request, res: Response) => {
    try {
        const khid = req.params.khid;

        const kh = await khach_hang.findOne({
            where: {
                khid: khid
            }
        })

        if(!kh) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.ID_NOT_EXITS,
                errors: {
                    khid: CustomerMess.ID_NOT_EXITS
                }
            })
            return;
        }

        // Check Exits CMND
        const checkCMND = await khach_hang.findOne({
            where: {
                khid: {
                    [Op.ne]: khid
                },
                cmnd: req.body.cmnd
            }
        })

        if(checkCMND) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.EMAIL_EXITS,
                errors: {
                    email: CustomerMess.EMAIL_EXITS
                }
            })
            return;
        }
        // End Check Exits CMND

        // Check Exits Email
        const checkMail = await khach_hang.findOne({
            where: {
                khid: {
                    [Op.ne]: khid
                },
                email: req.body.email
            }
        })

        if(checkMail) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.EMAIL_EXITS,
                errors: {
                    email: CustomerMess.EMAIL_EXITS
                }
            })
            return;
        }
        // End Check Exits Email

        delete req.body.khid;
        delete req.body.nvid;

        await khach_hang.update(req.body, {
            where: {
                khid: khid
            }
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.UPDATE_SUCCESS
        })
      } catch (error) {
        console.log('Error in update customer controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}

// [GET] /customer/request/list
export const listRequest = async (req: Request, res: Response) => {
    try {
        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        // End Pagination

        const { rows, count } = await yeu_cau_khach_hang.findAndCountAll({
            where: {},
            limit,
            offset,
            raw: true
        });

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: rows,
            pagination: {
                currentPage: page,
                pageSize: limit,
                countRecord: count,
                totalPage: Math.ceil(count/limit)
            }
        })
      } catch (error) {
        console.log('Error in get list request customer controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [POST] /customer/request/create 
export const createRequest = async (req: Request, res: Response) => {
    try {
        // Check ID Customer
        const kh = await khach_hang.findOne({
            where: {
                khid: req.body.khid
            }
        })
        if(!kh) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CustomerMess.ID_NOT_EXITS,
                errors: {
                    khid: CustomerMess.ID_NOT_EXITS
                }
            })
            return;
        }
        // End Check ID Customer

        // Check Type RealEstate
        const type = await loai_bds.findOne({
            where: {
                loaiid: req.body.loaiid
            }
        })
        if(!type) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.IDTYPE_INVALID,
                errror: {
                    loaiid: RealEstateMess.IDTYPE_INVALID
                }
            })
            return;
        }
        // End Check Type RealEstate

        // Check Price
        if(req.body.giaf > req.body.giat) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.PRICE_INVALID,
                errors: {
                    giaf: RealEstateMess.PRICE_INVALID,
                    giat: RealEstateMess.PRICE_INVALID
                }
            })
            return;
        }
        // End Check Price

        // Check Size
        if(req.body.daif > req.body.dait) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.PRICE_INVALID,
                errors: {
                    daif: RealEstateMess.PRICE_INVALID,
                    dait: RealEstateMess.PRICE_INVALID
                }
            })
            return;
        }
        if(req.body.rongf > req.body.rongt) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: RealEstateMess.PRICE_INVALID,
                errors: {
                    rongf: RealEstateMess.PRICE_INVALID,
                    rongt: RealEstateMess.PRICE_INVALID
                }
            })
            return;
        }
        // End Check Size


        let data: YeuCauKHCreationAttributes = {
            loaiid: req.body.loaiid,
            khid: req.body.khid,
            vitri: req.body.vitri,
            mota: req.body.mota??"",
            giaf: req.body.giaf,
            giat: req.body.giat,
            daif: req.body.daif,
            dait: req.body.dait,
            rongf: req.body.rongf,
            rongt: req.body.rongt
        }

        const yckh = await yeu_cau_khach_hang.create(data);

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.CREATE_SUCCESS,
            data: yckh.dataValues
        })
      } catch (error) {
        console.log('Error in create request customer controller: ', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}