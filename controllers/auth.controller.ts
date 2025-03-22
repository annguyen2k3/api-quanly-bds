import { Request, Response } from "express";
import nhan_vien from "../models/nhan_vien.model";
import { generateToken } from "../helper/generateToken";
import bcrypt from "bcryptjs";

// [POST] /auth/login
export const login = async (req: Request, res: Response) => {
    try {
        const taikhoan = req.body.taikhoan;
        const matkhau = req.body.matkhau;
        
        if(!taikhoan || !matkhau) {
            res.status(400).json({
                    code: 400,
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
            res.status(400).json({
                code: 400,
                message: "Tài khoản không tồn tại!"
            })
            return;
        }

        if(nhanvien["trangthai"] === 0) {
            res.status(400).json({
                code: 400,
                message: "Tài khoản đã bị khoá!"
            })
            return;
        }

        const checkPass =  bcrypt.compareSync(matkhau, nhanvien["matkhau"])

        if(!checkPass) {
            res.status(400).json({
                code: 400,
                message: "Mật khẩu không đúng!"
            })
            return;
        }

        const token = generateToken(nhanvien["nvid"], res);
        delete nhanvien["matkhau"]

        res.status(200).json({
            code: 200,
            message: "Đăng nhập thành công!",
            data: {
                ...nhanvien,
                token
            }
        })
    } catch(err) {
        console.log('Error in login controller: ' +  err.message);
        res.status(500).json({code: 500, message: 'Internal Server Error' });
    }
}

// [GET] /auth/logout
export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie('token', '', { maxAge: 0 });
        res.status(200).json({code: 200, message: 'Đăng xuất thành công' });
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({code: 500, message: 'Lỗi Server' });
      }
}

// [GET] /auth/profile
export const profile = async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            code: 200,
            message: "Lấy thông tin thành công!",
            data: {
                ...res.locals.user
            }
        })
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({code: 500, message: 'Lỗi Server' });
      }
}
