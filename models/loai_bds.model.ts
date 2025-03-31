import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type LoaiBDSAttributes = {
    loaiid: number;
    tenloai: string;
}

export class LoaiBDS extends Model<LoaiBDSAttributes> implements LoaiBDSAttributes {
    loaiid!: number;
    tenloai!: string;
}

export const loai_bds = sequelize.define<LoaiBDS>('loai_bds', {
    loaiid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    tenloai: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
  tableName: "loai_bds",
  timestamps: false
});

