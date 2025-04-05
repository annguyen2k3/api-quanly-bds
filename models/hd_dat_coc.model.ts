import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type HDDatCocAttributes = {
    dcid: number;
    khid: number;
    bdsid: number;
    ngaylaphd: Date;
    giatri: number;
    tinhtrang: number;
    ngayhethan: Date;
}

export interface HDDatCocCreateAttributes extends Optional<HDDatCocAttributes, 'dcid' | 'ngaylaphd' | 'tinhtrang'> {}

export class HDDatCoc extends Model<HDDatCocAttributes, HDDatCocCreateAttributes> implements HDDatCocAttributes {
    dcid!: number;
    khid!: number;
    bdsid!: number;
    ngaylaphd!: Date;
    giatri!: number;
    tinhtrang!: number;
    ngayhethan!: Date;
}

export const hd_dat_coc = sequelize.define<HDDatCoc>('hd_dat_coc', {
  dcid: {
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
  ngaylaphd: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Date.now()
  },
  giatri: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  tinhtrang: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  ngayhethan: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: "hop_dong_dat_coc",
  timestamps: false
});

