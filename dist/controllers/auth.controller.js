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
exports.profile = exports.logout = exports.login = void 0;
const nhan_vien_model_1 = __importDefault(require("../models/nhan_vien.model"));
const generateToken_1 = require("../helper/generateToken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taikhoan = req.body.taikhoan;
        const matkhau = req.body.matkhau;
        if (!taikhoan || !matkhau) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "Thông tin bị thiếu!"
            });
            return;
        }
        const nhanvien = yield nhan_vien_model_1.default.findOne({
            where: {
                taikhoan: taikhoan
            },
            raw: true
        });
        if (!nhanvien) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                code: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: "Tài khoản không tồn tại!"
            });
            return;
        }
        if (nhanvien["trangthai"] === 0) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                code: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: "Tài khoản đã bị khoá!"
            });
            return;
        }
        const checkPass = bcryptjs_1.default.compareSync(matkhau, nhanvien["matkhau"]);
        if (!checkPass) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "Mật khẩu không đúng!"
            });
            return;
        }
        const token = (0, generateToken_1.generateToken)(nhanvien["nvid"], res);
        delete nhanvien["matkhau"];
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            message: "Đăng nhập thành công!",
            data: Object.assign(Object.assign({}, nhanvien), { token })
        });
    }
    catch (err) {
        console.log('Error in login controller: ' + err.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('token', '', { maxAge: 0 });
        res.status(http_status_codes_1.StatusCodes.OK).json({ code: http_status_codes_1.StatusCodes.OK, message: 'Đăng xuất thành công' });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
    }
});
exports.logout = logout;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            message: "Lấy thông tin thành công!",
            data: Object.assign({}, res.locals.user)
        });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
    }
});
exports.profile = profile;
