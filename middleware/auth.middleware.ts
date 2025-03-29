import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { nhan_vien, NhanVien} from "../models/nhan_vien.model";
import { StatusCodes } from "http-status-codes";
import { AuthMess, CommonMess } from "../constants/messages.constant";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
             res.status(StatusCodes.UNAUTHORIZED)
                .json({ 
                    code: StatusCodes.UNAUTHORIZED,
                    message: AuthMess.AUTH_REQUIRED
                });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: AuthMess.TOKEN_INVALID
            })
        }

        const id = decoded["nvId"];

        const user = await nhan_vien.findOne({
            where: {
                nvid: id
            },
            raw: true
        })

        if(user["trangthai"] === 0 ) {
            res.status(StatusCodes.UNAUTHORIZED).json({ 
                code: StatusCodes.UNAUTHORIZED,
                message: AuthMess.ACCOUNT_INACTIVE 
            });
        }

        res.locals.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: CommonMess.SERVER_ERROR
        });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(res.locals.user.quyen !== 0) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: AuthMess.ROLE_NOT_ACCESS
            })
            return;
        }

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: CommonMess.SERVER_ERROR 
        });
    }
}

export const isNhanvien = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(res.locals.user.quyen !== 1) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: AuthMess.ROLE_NOT_ACCESS
            })
            return;
        }

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: CommonMess.SERVER_ERROR 
        });
    }
}
