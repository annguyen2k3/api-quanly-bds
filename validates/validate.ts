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
                // Nếu có lỗi validation, khởi tạo object để chứa thông tin lỗi
                const errorMessages: { [key: string]: string } = {};

               // Lặp qua từng lỗi và lấy thông tin field và thông điệp lỗi
                error.errors.forEach((issue) => {
                    const field = issue.path?.[0];
                    if (field) {
                    errorMessages[field] = issue.message;
                    }
                });

                 // Trả về thông báo lỗi
                res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ 
                    code: StatusCodes.UNPROCESSABLE_ENTITY,
                    message: CommonMess.INVALID_DATA,
                    errors: errorMessages
                });
            } else {
                // Nếu không phải lỗi ZodError, log lỗi và trả về mã lỗi server
                console.log("ERR: " + error.message)
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: CommonMess.SERVER_ERROR
                });
            }
      }
    };
  }

