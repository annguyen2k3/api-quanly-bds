import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type KhachHangAttributes = {
  khid: number;
  nvid: number;
  hoten: string;
  diachi: string;
  diachitt: string;
  cmnd: string;
  ngaysinh: Date;
  sdt: string;
  gioitinh: number;
  email: string;
  loaikh: number;
  mota: string;
  trangthai: number;
}

export interface KhachHangCreationAttributes extends Optional<KhachHangAttributes, 'khid' | 'mota' | 'trangthai'> {}

// Model khach_hang với các thuộc tính cần có
export class KhachHang extends Model<KhachHangAttributes, KhachHangCreationAttributes> implements KhachHangAttributes {
  khid!: number;
  nvid!: number;
  hoten!: string;
  diachi!: string;
  diachitt!: string;
  cmnd!: string;
  ngaysinh!: Date;
  sdt!: string;
  gioitinh!: number;
  email!: string;
  loaikh!: number;
  mota!: string;
  trangthai!: number;
}

export const khach_hang = sequelize.define<KhachHang>('khach_hang', {
  khid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  nvid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hoten: {
    type: DataTypes.STRING,
    allowNull: false
  },
  diachi: {
    type: DataTypes.STRING,
    allowNull: false
  },
  diachitt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cmnd: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  ngaysinh: {
    type: DataTypes.DATE,
    allowNull: false
  },
  sdt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gioitinh: {
    type: DataTypes.INTEGER
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  loaikh: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  mota: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trangthai: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
}, {
  tableName: "khach_hang",
  timestamps: false
});

