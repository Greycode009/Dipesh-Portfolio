import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '@/config/database';

export class Social extends Model<
  InferAttributes<Social>,
  InferCreationAttributes<Social>
> {
  declare id: CreationOptional<number>;
  declare label: string;
  declare url: string;
  declare icon: string;
  declare sortOrder: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Social.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING(1024), allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'socials' },
);
