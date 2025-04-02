import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export const hinh_bds = sequelize.define('hinh_bds', {
    hinhid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    hinh: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bdsid: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
  tableName: "hinh_bds",
  timestamps: false
});

