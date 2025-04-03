import { Request, Response, NextFunction } from "express";
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { CommonMess } from "../constants/messages.constant";

export function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Khởi tạo object để chứa thông tin lỗi
                const errorMessages: { [key: string]: string } = {};
                
                // Lặp qua từng lỗi và lấy thông tin
                error.errors.forEach((issue) => {
                    // Xử lý lỗi "unrecognized key"
                    if (issue.code === 'unrecognized_keys') {
                        // Nếu có lỗi unrecognized keys
                        const keys = issue.keys || [];
                        errorMessages['_errors'] = `Trường không hợp lệ: ${keys.join(', ')}`;
                    } else {
                        // Xử lý các lỗi validation khác
                        const field = issue.path?.[0];
                        if (field) {
                            errorMessages[field] = issue.message;
                        }
                    }
                });
                
                // Trả về thông báo lỗi
                res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                    code: StatusCodes.UNPROCESSABLE_ENTITY,
                    message: CommonMess.INVALID_DATA,
                    errors: errorMessages
                });
            } else {
                // Nếu không phải lỗi ZodError
                console.log("ERR: " + error.message);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: CommonMess.SERVER_ERROR
                });
            }
        }
    };
}