"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = void 0;
const validator_1 = __importDefault(require("validator"));
const info = (req, res, next) => {
    try {
        const taikhoan = req.body.taikhoan;
        const matkhau = req.body.matkhau;
        const tennv = req.body.tennv;
        const sdt = req.body.sdt;
        const diachi = req.body.diachi;
        const ngaysinh = req.body.ngaysinh;
        const gioitinh = req.body.gioitinh;
        const email = req.body.email;
        const quyen = req.body.quyen;
        if (taikhoan && matkhau && tennv && sdt && diachi && ngaysinh && gioitinh != null && email && quyen != null) {
            if (matkhau.length < 6) {
                res.status(400).json({
                    code: 400,
                    message: "Mật khẩu ít nhất 6 ký tự!"
                });
                return;
            }
            if (sdt.toString().length != 9) {
                res.status(400).json({
                    code: 400,
                    message: "Số điện thoại không hợp lệ!"
                });
                return;
            }
            if (!validator_1.default.isEmail(email)) {
                res.status(400).json({
                    code: 400,
                    message: "Email không hợp lệ!"
                });
                return;
            }
            next();
        }
        else {
            res.status(400).json({
                code: 400,
                message: "Thông tin bị thiếu!"
            });
        }
    }
    catch (error) {
        console.log("ERROR: " + error.message);
        res.status(500).json({
            code: 500,
            message: "Lỗi Server!"
        });
    }
};
exports.info = info;
