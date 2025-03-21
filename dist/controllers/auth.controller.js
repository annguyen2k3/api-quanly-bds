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
exports.resetPassword = exports.logout = exports.login = void 0;
const nhan_vien_model_1 = __importDefault(require("../models/nhan_vien.model"));
const generateToken_1 = require("../helper/generateToken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taikhoan = req.body.taikhoan;
        const matkhau = req.body.matkhau;
        if (!taikhoan || !matkhau) {
            res.status(400).json({
                message: "Thông tin bị thiếu!"
            });
            return;
        }
        const nhanvien = yield nhan_vien_model_1.default.findOne({
            where: {
                taikhoan: taikhoan,
                trangthai: 1
            },
            raw: true
        });
        if (!nhanvien) {
            res.status(400).json({
                message: "Tài khoản không tồn tại!"
            });
            return;
        }
        const checkPass = bcryptjs_1.default.compareSync(matkhau, nhanvien["matkhau"]);
        if (!checkPass) {
            res.status(400).json({
                message: "Mật khẩu không đúng!"
            });
            return;
        }
        const token = (0, generateToken_1.generateToken)(nhanvien["nvid"], res);
        delete nhanvien["matkhau"];
        res.status(200).json({
            code: 200,
            message: "Đăng nhập thành công!",
            data: Object.assign(Object.assign({}, nhanvien), { token })
        });
    }
    catch (err) {
        console.log('Error in login controller: ' + err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('token', '', { maxAge: 0 });
        res.status(200).json({ message: 'Đăng xuất thành công' });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({ message: 'Lỗi Server' });
    }
});
exports.logout = logout;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.nvid;
        const newPass = req.body.newPassword;
        if (!id || !newPass) {
            res.status(400).json({
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
            message: "Đặt lại mật khẩu thành công!",
        });
    }
    catch (error) {
        console.log('Error in login controller: ' + error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.resetPassword = resetPassword;
