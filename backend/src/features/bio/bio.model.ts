import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '@/config/database';

/** Singleton — always row id 1. */
export class Bio extends Model<
  InferAttributes<Bio>,
  InferCreationAttributes<Bio>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare headline: string;
  declare roles: string[];
  declare story: string[];
  declare quote: string;
  declare avatarUrl: string;
  declare portraitUrl: string;
  declare homeIntro: string;
  declare heroStatValue: CreationOptional<string>;
  declare heroStatLabel: CreationOptional<string>;
  declare location: string;
  declare email: string;
  declare phone: string;
  declare availableForWork: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Bio.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    headline: { type: DataTypes.STRING, allowNull: false },
    roles: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    story: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    quote: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    avatarUrl: { type: DataTypes.STRING(1024), allowNull: false },
    portraitUrl: { type: DataTypes.STRING(1024), allowNull: false },
    homeIntro: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    // The third figure in the hero. The other two are counted from the
    // projects and skills tables, so only this one needs storing.
    heroStatValue: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '2yr',
    },
    heroStatLabel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Building for the web',
    },
    location: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    availableForWork: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'bio' },
);
