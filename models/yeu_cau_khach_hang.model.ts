import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type YeuCauKHAttributes = {
  ycid: number;
  loaiid: number;
  khid: number;
  vitri: string;
  mota: string;
  giaf: number;
  giat: number;
  daif: number;
  dait: number;
  rongf: number;
  rongt: number;
}

export interface YeuCauKHCreationAttributes extends Optional<YeuCauKHAttributes, 'ycid' | 'mota' > {}

// Model khach_hang với các thuộc tính cần có
export class YeuCauKH extends Model<YeuCauKHAttributes, YeuCauKHCreationAttributes> implements YeuCauKHAttributes {
    ycid!: number;
    loaiid!: number;
    khid!: number;
    vitri!: string;
    mota!: string;
    giaf!: number;
    giat!: number;
    daif!: number;
    dait!: number;
    rongf!: number;
    rongt!: number;
}

export const yeu_cau_khach_hang = sequelize.define<YeuCauKH>('yeu_cau_khach_hang', {
    ycid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    loaiid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    khid: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    vitri: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mota: {
        type: DataTypes.STRING,
        allowNull: true
    },
    giaf: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    giat: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    daif: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    dait: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    rongf: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    rongt: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
}, {
  tableName: "yeu_cau_khach_hang",
  timestamps: false
});

