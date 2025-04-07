import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type HDChuyenNhuongAttributes = {
    cnid: number;
    khid: number;
    bdsid: number;
    dcid: number;
    giatri: number;
    ngaylap: Date;
    trangthai: number;
}

export interface HDChuyenNhuongCreateAttributes extends Optional<HDChuyenNhuongAttributes,'cnid' | 'ngaylap' | 'trangthai'> {}

export class HDChuyenNhuong extends Model<HDChuyenNhuongAttributes, HDChuyenNhuongCreateAttributes> implements HDChuyenNhuongAttributes {
    cnid!: number;
    khid!: number;
    bdsid!: number;
    dcid!: number;
    giatri!: number;
    ngaylap!: Date;
    trangthai!: number;
}

export const hd_chuyen_nhuong = sequelize.define<HDChuyenNhuong>('hd_chuyen_nhuong', {
  cnid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  khid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bdsid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dcid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  giatri: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ngaylap: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Date.now()
  },
  trangthai: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  
}, {
  tableName: "hop_dong_chuyen_nhuong",
  timestamps: false
});

