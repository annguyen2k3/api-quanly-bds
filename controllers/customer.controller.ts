import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { CommonMess, CustomerMess } from "../constants/messages.constant";
import { khach_hang, KhachHang, KhachHangCreationAttributes } from "../models/khach_hang.model";
import { Op } from "sequelize";

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

// [GET] /customer/detail/:khid
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

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: khachhang
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
            mota: req.body.mota,
        }

        const kh = await khach_hang.create(data);

        console.log(kh)

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