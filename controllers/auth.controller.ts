import { Request, Response } from "express";
import { nhan_vien, NhanVien} from "../models/nhan_vien.model";
import { generateToken } from "../helper/generateToken";
import bcrypt from "bcryptjs";
import { StatusCodes } from 'http-status-codes';

// [POST] /auth/login
export const login = async (req: Request, res: Response) => {
    try {
        const taikhoan = req.body.taikhoan;
        const matkhau = req.body.matkhau;
        
        if(!taikhoan || !matkhau) {
            res.status(StatusCodes.BAD_REQUEST).json({
                    code: StatusCodes.BAD_REQUEST,
                    message: "Thông tin bị thiếu!"
            })
            return;
        }

        const nhanvien = await nhan_vien.findOne({
            where: {
                taikhoan: taikhoan
            },
            raw: true
        })
        
        if(!nhanvien) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: "Tài khoản không tồn tại!"
            })
            return;
        }

        if(nhanvien["trangthai"] === 0) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: "Tài khoản đã bị khoá!"
            })
            return;
        }

        const checkPass =  bcrypt.compareSync(matkhau, nhanvien["matkhau"])

        if(!checkPass) {
            res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                message: "Mật khẩu không đúng!"
            })
            return;
        }

        const token = generateToken(nhanvien["nvid"], res);
        delete nhanvien["matkhau"]

        res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            message: "Đăng nhập thành công!",
            data: {
                ...nhanvien,
                token
            }
        })
    } catch(err) {
        console.log('Error in login controller: ' +  err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
    }
}

// [POST] /auth/logout
export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie('token', '', { maxAge: 0 });
        res.status(StatusCodes.OK).json({code: StatusCodes.OK, message: 'Đăng xuất thành công' });
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
      }
}


