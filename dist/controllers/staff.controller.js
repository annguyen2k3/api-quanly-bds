"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.detail = void 0;
const nhan_vien_model_1 = __importDefault(require("../models/nhan_vien.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.nvid);
        const nhanvien = yield nhan_vien_model_1.default.findOne({
            where: {
                nvid: id
            },
            attributes: { exclude: ['matkhau'] },
            raw: true
        });
        if (!nhanvien) {
            res.status(400).json({
                code: 400,
                message: "Nhân viên không tồn tại."
            });
            return;
        }
        res.status(200).json({
            code: 200,
            message: "Lấy thông tin thành công!",
            data: Object.assign({}, nhanvien)
        });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ message: 'Lỗi Server' });
    }
});
exports.detail = detail;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.nvid;
        const newPass = req.body.newPassword;
        if (!id || !newPass) {
            res.status(400).json({
                code: 400,
                message: "Thiếu thông tin!"
            });
            return;
        }
        const nv = yield nhan_vien_model_1.default.findOne({
            where: {
                nvid: id
            },
            raw: true
        });
        if (!nv) {
            res.status(400).json({
                code: 400,
                message: "Mã nhân viên không tồn tại!"
            });
            return;
        }
        const hashPass = bcryptjs_1.default.hashSync(newPass, 10);
        yield nhan_vien_model_1.default.update({
            matkhau: hashPass
        }, {
            where: {
                nvid: id
            }
        });
        res.status(200).json({
            code: 200,
            message: "Đặt lại mật khẩu thành công!",
        });
    }
    catch (error) {
        console.log('Error in login controller: ' + error);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
});
exports.resetPassword = resetPassword;
