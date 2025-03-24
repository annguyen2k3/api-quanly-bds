"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
function validateData(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => {
                    var _a;
                    return ({
                        [(_a = issue.path) === null || _a === void 0 ? void 0 : _a[0]]: issue.message
                    });
                });
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Thông tin không hợp lệ",
                    errors: errorMessages
                });
            }
            else {
                console.log("ERR: " + error.message);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: 'Lỗi Server'
                });
            }
        }
    };
}
