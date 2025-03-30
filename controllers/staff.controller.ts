import { Request, Response } from "express";
import { nhan_vien, NhanVien} from "../models/nhan_vien.model";

import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Op, Sequelize } from "sequelize";
import { AuthMess, CommonMess, StaffMess } from "../constants/messages.constant";

// [GET] /staff/detail/:nvId
export const detail = async (req: Request, res: Response) => {
    try {
        const id =  parseInt(req.params.nvid);

        const nhanvien: NhanVien = await nhan_vien.findOne({
            where: {
                nvid: id
            },
            attributes: { exclude: ['matkhau'] },
            raw: true
        })

        if(!nhanvien) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: StaffMess.ID_NOT_EXITS
            })
            return;
        }

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: {
                ...nhanvien
            }
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [GET] /staff/list
export const getList = async (req: Request, res: Response) => {
    try {
        const whereObject = {}

        // Find Status
        const status = parseInt(req.query.status as string, 10);
        if ([0, 1].includes(status)) {
          whereObject["trangthai"] = status;
        } else {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: StaffMess.STATUS_INVALID
            })
            return;
        }
        // End Find Status

        // Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        // End Pagination

        const { rows, count } = await nhan_vien.findAndCountAll({
            where: whereObject,
            attributes: { exclude: ['matkhau'] },
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
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [POST] /staff/create 
export const create = async (req: Request, res: Response) => {
    try {
        const checkMail = await nhan_vien.findOne({
            where: {
                email: req.body.email
            }
        })

        if(checkMail) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: StaffMess.EMAIL_EXITS,
                errors: {
                    email: StaffMess.EMAIL_EXITS
                }
            })
            return;
        }

        const checkTaikhoan = await nhan_vien.findOne({
            where: {
                taikhoan: req.body.taikhoan
            }
        })

        if(checkTaikhoan) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: AuthMess.ACCOUNT_EXITS,
                errors: {
                    taikhoan: AuthMess.ACCOUNT_EXITS
                }
            })
            return;
        }

        const passHash = await bcrypt.hashSync(req.body.matkhau, parseInt(process.env.SALT_ROUNDS))

        const dataNv = {
            taikhoan: req.body.taikhoan,
            matkhau: passHash ,
            tennv: req.body.tennv,
            sdt: req.body.sdt,
            diachi: req.body.diachi,
            ngaysinh: req.body.ngaysinh,
            gioitinh: req.body.gioitinh,
            email: req.body.email,
            quyen: req.body.quyen,
        }

        await nhan_vien.create(dataNv)

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.CREATE_SUCCESS
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}

// [PUT] /staff/update/:id
export const update = async (req: Request, res: Response) => {
    try {
        const nvid = req.params.id;

        const nv = await nhan_vien.findOne({
            where: {
                nvid: nvid
            }
        })

        if(!nv) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: StaffMess.ID_NOT_EXITS,
                errors: {
                    nvid: StaffMess.ID_NOT_EXITS
                }
            })
            return;
        }

        const checkMail = await nhan_vien.findOne({
            where: {
                nvid: {
                    [Op.ne]: nvid
                },
                email: req.body.email
            }
        })

        if(checkMail) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: StaffMess.EMAIL_EXITS,
                errors: {
                    email: StaffMess.EMAIL_EXITS
                }
            })
            return;
        }

        const checkTaikhoan = await nhan_vien.findOne({
            where: {
                nvid: {
                    [Op.ne]: nvid
                },
                taikhoan: req.body.taikhoan
            }
        })

        if(checkTaikhoan) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: AuthMess.ACCOUNT_EXITS,
                errors: {
                    taikhoan: AuthMess.ACCOUNT_EXITS
                }
            })
            return;
        }

        if(req.body.matkhau) {
            req.body.matkhau = await bcrypt.hashSync(req.body.matkhau, parseInt(process.env.SALT_ROUNDS))
        } else {
            delete req.body.matkhau
        }

        await nhan_vien.update(req.body, {
            where: {
                nvid: nvid
            }
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.UPDATE_SUCCESS
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}
