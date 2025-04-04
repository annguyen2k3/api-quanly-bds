import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type HDKyGuiAttributes = {
    kgid: number;
    khid: number;
    bdsid: number;
    giatri: number;
    chiphidv: number;
    ngaybatdau: Date;
    ngayketthuc: Date;
    trangthai: number;
}

export interface HDKyGuiCreateAttributes extends Optional<HDKyGuiAttributes, 'kgid' | 'trangthai'> {}

export class HDKyGui extends Model<HDKyGuiAttributes, HDKyGuiCreateAttributes> implements HDKyGuiAttributes {
    kgid!: number;
    khid!: number;
    bdsid!: number;
    giatri!: number;
    chiphidv!: number;
    ngaybatdau!: Date;
    ngayketthuc!: Date;
    trangthai!: number;
}

export const hd_ky_gui = sequelize.define<HDKyGui>('hd_ky_gui', {
  kgid: {
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
  giatri: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  chiphidv: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ngaybatdau: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ngayketthuc: {
    type: DataTypes.DATE,
    allowNull: false
  },
  trangthai: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: "hop_dong_ky_gui",
  timestamps: false
});

