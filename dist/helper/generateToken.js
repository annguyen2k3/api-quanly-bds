"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (nvId, res) => {
    const token = jsonwebtoken_1.default.sign({ nvId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    return token;
};
exports.generateToken = generateToken;
