import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const nhan_vien = sequelize.define("nhan_vien", {
    nvid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    taikhoan: {
        type: DataTypes.STRING(50)
    },
    matkhau: {
        type: DataTypes.STRING(100)
    },
    tennv: {
        type: DataTypes.STRING(50)
    },
    sdt: {
        type: DataTypes.BIGINT
    },
    diachi: {
        type: DataTypes.STRING(255)
    },
    ngaysinh: {
        type: DataTypes.DATE
    },
    gioitinh: {
        type: DataTypes.TINYINT
    },
    doanhthu: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    email: {
        type: DataTypes.STRING(255)
    },
    quyen: {
        type: DataTypes.TINYINT
    },
    trangthai: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
}, {
    tableName: "nhan_vien",
    timestamps: false
})

export default nhan_vien