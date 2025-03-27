import { Request, Response } from "express";
import { nhan_vien, NhanVien} from "../models/nhan_vien.model";

import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";

// [GET] /me
export const profile = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;

        delete user.matkhau

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: "Lấy thông tin thành công!",
            data: {
                ...user
            }
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
      }
}

// [PUT] /me
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;

        console.log(user)

        const checkMail = await nhan_vien.findOne({
            where: {
                nvid: {
                    [Op.ne]: user.nvid
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
                    [Op.ne]: user.nvid
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

        await nhan_vien.update(req.body, {
            where: {
                nvid: user.nvid
            }
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: "Cập nhật thành công!"
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
      }
}

// [PUT] /me/change-pass
export const changePass = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;

        console.log(user)

        const checkPass =  bcrypt.compareSync(req.body.matkhaucu, user["matkhau"])
        
        if(!checkPass) {
            res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                message: "Mật khẩu không đúng!"
            })
            return;
        }

        const passHash = await bcrypt.hashSync(req.body.matkhaumoi, parseInt(process.env.SALT_ROUNDS))

        await nhan_vien.update({
            matkhau: passHash
        }, {
            where: {
                nvid: user.nvid
            }
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: "Thay đổi mật khẩu thành công!"
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
      }
}

