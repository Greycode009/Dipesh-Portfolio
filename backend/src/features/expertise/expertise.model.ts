import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '@/config/database';

/** The cards on the home page. */
export class Expertise extends Model<
  InferAttributes<Expertise>,
  InferCreationAttributes<Expertise>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare icon: string;
  declare technologies: string[];
  declare sortOrder: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Expertise.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: false },
    technologies: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'expertise' },
);
