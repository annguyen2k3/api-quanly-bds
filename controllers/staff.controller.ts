import { Request, Response } from "express";
import { nhan_vien, NhanVien} from "../models/nhan_vien.model";

import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Op, Sequelize } from "sequelize";

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
            res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: "Nhân viên không tồn tại."
            })
            return;
        }

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: "Lấy thông tin thành công!",
            data: {
                ...nhanvien
            }
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
      }
}

// [GET] /staff/list
export const getList = async (req: Request, res: Response) => {
    try {
        const list = await nhan_vien.findAll({
            where: {
                trangthai: 1
            },
            attributes: { exclude: ['matkhau'] },
            raw: true
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: "Lấy thông tin thành công!",
            data: [
                ...list
            ]
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
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
            res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                message: "Email đã tồn tại"
            })
            return;
        }

        const checkTaikhoan = await nhan_vien.findOne({
            where: {
                taikhoan: req.body.taikhoan
            }
        })

        if(checkTaikhoan) {
            res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                message: "Tài khoản đã tồn tại"
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
            message: "Tạo thành công!"
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
            res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                message: "Mã nhân viên không tồn tại"
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
            res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                message: "Email đã tồn tại"
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
            res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                message: "Tài khoản đã tồn tại"
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
            message: "Cập nhật thành công!"
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
      }
}
