"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const nhan_vien = database_1.default.define("nhan_vien", {
    nvid: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    taikhoan: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    matkhau: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    tennv: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    sdt: {
        type: sequelize_1.DataTypes.BIGINT
    },
    diachi: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    ngaysinh: {
        type: sequelize_1.DataTypes.DATE
    },
    gioitinh: {
        type: sequelize_1.DataTypes.TINYINT
    },
    doanhthu: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255)
    },
    quyen: {
        type: sequelize_1.DataTypes.TINYINT
    },
    trangthai: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: "nhan_vien",
    timestamps: false
});
exports.default = nhan_vien;
