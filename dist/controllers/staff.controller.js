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
exports.resetPassword = exports.create = exports.detail = void 0;
const nhan_vien_model_1 = __importDefault(require("../models/nhan_vien.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
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
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                code: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: "Nhân viên không tồn tại."
            });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            message: "Lấy thông tin thành công!",
            data: Object.assign({}, nhanvien)
        });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
    }
});
exports.detail = detail;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passHash = yield bcryptjs_1.default.hashSync(req.body.matkhau, parseInt(process.env.SALT_ROUNDS));
        const dataNv = {
            taikhoan: req.body.taikhoan,
            matkhau: passHash,
            tennv: req.body.tennv,
            sdt: req.body.sdt,
            diachi: req.body.diachi,
            ngaysinh: req.body.ngaysinh,
            gioitinh: req.body.gioitinh,
            email: req.body.email,
            quyen: req.body.quyen,
        };
        yield nhan_vien_model_1.default.create(dataNv);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            message: "Tạo thành công!"
        });
    }
    catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server: ' + error.message });
    }
});
exports.create = create;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.nvid;
        const newPass = req.body.newPassword;
        if (!id || !newPass) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "Thiếu thông tin!"
            });
            return;
        }
        if (newPass.length < 6) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: "Mật khẩu tối thiểu 6 ký tự!"
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
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                code: http_status_codes_1.StatusCodes.UNAUTHORIZED,
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
        res.status(http_status_codes_1.StatusCodes.OK).json({
            code: http_status_codes_1.StatusCodes.OK,
            message: "Đặt lại mật khẩu thành công!",
        });
    }
    catch (error) {
        console.log('Error in login controller: ' + error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ code: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, message: 'Lỗi Server' });
    }
});
exports.resetPassword = resetPassword;
