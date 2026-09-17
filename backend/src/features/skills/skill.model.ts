import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '@/config/database';

export class Skill extends Model<
  InferAttributes<Skill>,
  InferCreationAttributes<Skill>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare icon: string;
  declare description: string;
  declare category: string;
  /** 1-5. Drives inventory item rarity in the pixel room. */
  declare proficiency: number;
  declare itemSprite: CreationOptional<string>;
  declare sortOrder: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Skill.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    icon: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    proficiency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      validate: { min: 1, max: 5 },
    },
    itemSprite: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'item-default',
    },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'skills' },
);
