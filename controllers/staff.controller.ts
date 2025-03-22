import { Request, Response } from "express";
import nhan_vien from "../models/nhan_vien.model";

import bcrypt from "bcryptjs";

// [GET] /staff/detail/:nvId
export const detail = async (req: Request, res: Response) => {
    try {
        const id =  parseInt(req.params.nvid);

        const nhanvien = await nhan_vien.findOne({
            where: {
                nvid: id
            },
            attributes: { exclude: ['matkhau'] },
            raw: true
        })

        if(!nhanvien) {
            res.status(400).json({
                code: 400,
                message: "Nhân viên không tồn tại."
            })
            return;
        }

        res.status(200).json({
            code: 200,
            message: "Lấy thông tin thành công!",
            data: {
                ...nhanvien
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
                code: 400,
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
                code: 400,
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
            code: 200,
            message: "Đặt lại mật khẩu thành công!",
        })
    } catch (error) {
        console.log('Error in login controller: ' +  error);
        res.status(500).json({code: 500, message: 'Internal Server Error' });
    }
}