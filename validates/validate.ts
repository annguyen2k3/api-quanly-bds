import { Request, Response, NextFunction } from "express";
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';


export function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    [issue.path?.[0]]: issue.message
                }))
                res.status(StatusCodes.BAD_REQUEST).json({ 
                    code: StatusCodes.BAD_REQUEST,
                    message: "Thông tin không hợp lệ",
                    errors: errorMessages
                });
            } else {
                console.log("ERR: " + error.message)
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: 'Lỗi Server'
                });
            }
      }
    };
  }

