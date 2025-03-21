import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import nhan_vien from "../models/nhan_vien.model";

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
             res.status(401)
                .json({ 
                    code: 401,
                    message: "Vui lòng đăng nhập!"
                });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            res.status(401).json({
                code: 401,
                message: "Token không hợp lệ!"
            })
        }

        const id = decoded["nvId"];

        const user = await nhan_vien.findOne({
            where: {
                nvid: id,
                trangthai: 1
            },
            attributes: { exclude: ['matkhau'] },
            raw: true
        })

        if(!user) {
            res.status(401).json({ 
                code: 401,
                message: "Lỗi tài khoản!" 
            });
        }

        res.locals.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ 
            code: 500,
            message: "Token không hợp lệ" 
        });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(res.locals.user.quyen !== 0) {
            res.status(401).json({
                code: 401,
                message: "Không có quyền truy cập"
            })
            return;
        }

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ 
            code: 500,
            message: "Lỗi Server!" 
        });
    }
}

export const idNhanvien = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(res.locals.user.quyen !== 1) {
            res.status(401).json({
                code: 401,
                message: "Không có quyền truy cập"
            })
            return;
        }

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ 
            code: 500,
            message: "Lỗi Server!" 
        });
    }
}
