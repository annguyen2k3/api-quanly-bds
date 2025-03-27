import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type NhanVienAttributes = {
  nvid: number;
  taikhoan: string;
  matkhau: string;
  tennv: string;
  sdt: number;
  diachi: string;
  ngaysinh: Date;
  gioitinh: number;
  doanhthu: number;
  email: string;
  quyen: number;
  trangthai: number;
}

// Interface cho trường hợp tạo mới (không cần nvid vì nó tự tăng)
export interface NhanVienCreationAttributes extends Optional<NhanVienAttributes, 'nvid'> {}

// Model nhan_vien với các thuộc tính cần có
export class NhanVien extends Model<NhanVienAttributes, NhanVienCreationAttributes> implements NhanVienAttributes {
  public nvid!: number;
  public taikhoan!: string;
  public matkhau!: string;
  public tennv!: string;
  public sdt!: number;
  public diachi!: string;
  public ngaysinh!: Date;
  public gioitinh!: number;
  public doanhthu!: number;
  public email!: string;
  public quyen!: number;
  public trangthai!: number;
}

export const nhan_vien = sequelize.define<NhanVien, NhanVienCreationAttributes>('nhan_vien', {
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
});

