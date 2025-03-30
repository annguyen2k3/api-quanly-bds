import { Request, Response } from "express";
import { nhan_vien, NhanVien} from "../models/nhan_vien.model";

import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { AuthMess, CommonMess, StaffMess } from "../constants/messages.constant";

// [GET] /me
export const profile = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;

        delete user.matkhau

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.GET_SUCCESS,
            data: {
                ...user
            }
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [PUT] /me
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;

        const checkMail = await nhan_vien.findOne({
            where: {
                nvid: {
                    [Op.ne]: user.nvid
                },
                email: req.body.email
            }
        })

        if(checkMail) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CommonMess.INVALID_DATA,
                errors: {
                    email: StaffMess.EMAIL_EXITS
                }
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
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CommonMess.INVALID_DATA,
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

        delete req.body.quyen;
        delete req.body.trangthai;

        await nhan_vien.update(req.body, {
            where: {
                nvid: user.nvid
            }
        })

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: CommonMess.UPDATE_SUCCESS
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

// [PUT] /me/change-pass
export const changePass = async (req: Request, res: Response) => {
    try {
        const user: NhanVien = res.locals.user;

        const checkPass =  bcrypt.compareSync(req.body.matkhaucu, user["matkhau"])
        
        if(!checkPass) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: AuthMess.PASSWORD_INCORRECT,
                errors: {
                    matkhau: AuthMess.PASSWORD_INCORRECT
                }
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}

