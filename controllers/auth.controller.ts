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
                    message: "Thông tin bị thiếu!"
            })
            return;
        }

        const nhanvien = await nhan_vien.findOne({
            where: {
                taikhoan: taikhoan,
                trangthai: 1
            },
            raw: true
        })
        
        if(!nhanvien) {
            res.status(400).json({
                message: "Tài khoản không tồn tại!"
            })
            return;
        }

        const checkPass =  bcrypt.compareSync(matkhau, nhanvien["matkhau"])

        if(!checkPass) {
            res.status(400).json({
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
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// [POST] /auth/logout
export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie('token', '', { maxAge: 0 });
        res.status(200).json({ message: 'Đăng xuất thành công' });
      } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ message: 'Lỗi Server' });
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
        res.status(500).json({ message: 'Lỗi Server' });
      }
}

// [PATCH] /auth/password-reset
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const id = req.body.nvid;
        const newPass = req.body.newPassword

        if(!id || !newPass) {
            res.status(400).json({
                message: "Thiếu thông tin!"
            })
            return;
        }

        const nv = await nhan_vien.findOne({
            where: {
                nvid: id
            },
            raw: true
        })

        if(!nv) {
            res.status(400).json({
                message: "Mã nhân viên không tồn tại!"
            })
            return;
        }

        const hashPass = bcrypt.hashSync(newPass, 10)

        await nhan_vien.update({
            matkhau: hashPass
        }, {
            where: {
                nvid: id
            }
        })

        res.status(200).json({
            message: "Đặt lại mật khẩu thành công!",
        })
    } catch (error) {
        console.log('Error in login controller: ' +  error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}