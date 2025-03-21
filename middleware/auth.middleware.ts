import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

        console.log(token)

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

