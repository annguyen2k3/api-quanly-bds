import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type BDSAttributes = {
  bdsid: number;
  loaiid: number;
  khid: number;
  tinhtrang: number;
  dientich: number;
  dongia: number;
  masoqsdd: string;
  mota: string;
  hinhanh: string;
  chieudai: number;
  chieurong: number;
  huehong: number;
  tenduong: string;
  thanhpho: string;
  sonha: string;
  quan: string;
  phuong: string;
}

export interface BDSCreationAttributes extends Optional<BDSAttributes, 'bdsid' | 'mota' | 'tinhtrang' | 'hinhanh'> {}

export class BatDongSan extends Model<BDSAttributes, BDSCreationAttributes> implements BDSAttributes {
    bdsid!: number;
    loaiid!: number;
    khid!: number;
    tinhtrang!: number;
    dientich!: number;
    dongia!: number;
    masoqsdd!: string;
    mota!: string;
    hinhanh: string;
    chieudai!: number;
    chieurong!: number;
    huehong!: number;
    tenduong!: string;
    thanhpho!: string;
    sonha!: string;
    quan!: string;
    phuong!: string;
}

export const bat_dong_san = sequelize.define<BatDongSan>('BatDongSan', {
  bdsid: {
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
  tinhtrang: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  dientich: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dongia: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  masoqsdd: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mota: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hinhanh: {
    type: DataTypes.STRING,
    allowNull: true
  },
  chieudai: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  chieurong: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  huehong: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  tenduong: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thanhpho: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sonha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phuong: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: "bat_dong_san",
  timestamps: false
});

