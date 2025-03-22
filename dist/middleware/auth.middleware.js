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
exports.isNhanvien = exports.isAdmin = exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nhan_vien_model_1 = __importDefault(require("../models/nhan_vien.model"));
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({
                code: 401,
                message: "Token không hợp lệ!"
            });
        }
        const id = decoded["nvId"];
        const user = yield nhan_vien_model_1.default.findOne({
            where: {
                nvid: id
            },
            attributes: { exclude: ['matkhau'] },
            raw: true
        });
        if (user["trangthai"] === 0) {
            res.status(401).json({
                code: 401,
                message: "Tài khoản đã bị khoá!"
            });
        }
        res.locals.user = user;
        next();
    }
    catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({
            code: 500,
            message: "Token không hợp lệ"
        });
    }
});
exports.protectRoute = protectRoute;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.user.quyen !== 0) {
            res.status(401).json({
                code: 401,
                message: "Không có quyền truy cập"
            });
            return;
        }
        next();
    }
    catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({
            code: 500,
            message: "Lỗi Server!"
        });
    }
});
exports.isAdmin = isAdmin;
const isNhanvien = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.user.quyen !== 1) {
            res.status(401).json({
                code: 401,
                message: "Không có quyền truy cập"
            });
            return;
        }
        next();
    }
    catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({
            code: 500,
            message: "Lỗi Server!"
        });
    }
});
exports.isNhanvien = isNhanvien;
