import { Request, Response } from "express";
import { nhan_vien, NhanVien} from "../models/nhan_vien.model";
import { generateToken } from "../helper/generateToken";
import bcrypt from "bcryptjs";
import { StatusCodes } from 'http-status-codes';
import { AuthMess, CommonMess, StaffMess } from "../constants/messages.constant";

// [POST] /auth/login
export const login = async (req: Request, res: Response) => {
    try {
        const taikhoan = req.body.taikhoan;
        const matkhau = req.body.matkhau;

        const nhanvien = await nhan_vien.findOne({
            where: {
                taikhoan: taikhoan
            },
            raw: true
        })
        
        if(!nhanvien) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CommonMess.INVALID_DATA,
                errors: {
                    taikhoan: AuthMess.ACCOUNT_NOT_EXITS
                }
            })
            return;
        }

        const checkPass =  bcrypt.compareSync(matkhau, nhanvien["matkhau"])

        if(!checkPass) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                code: StatusCodes.UNPROCESSABLE_ENTITY,
                message: CommonMess.INVALID_DATA,
                errors: {
                    matkhau: AuthMess.PASSWORD_INCORRECT
                }
            })
            return;
        }

        if(nhanvien["trangthai"] === 0) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: AuthMess.ACCOUNT_INACTIVE,
                errors: {
                    taikhoan: AuthMess.ACCOUNT_INACTIVE
                }
            })
            return;
        }

        const token = generateToken(nhanvien["nvid"], res);
        delete nhanvien["matkhau"]

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: AuthMess.LOGIN_SUCCESS,
            data: {
                ...nhanvien,
                token
            }
        })
    } catch(err) {
        console.log('Error in login controller: ' +  err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
    }
}

// [POST] /auth/logout
export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie('token', '', { maxAge: 0 });
        res.status(StatusCodes.OK).json({code: StatusCodes.OK, message: AuthMess.LOGOUT_SUCCESS });
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: CommonMess.SERVER_ERROR });
      }
}


