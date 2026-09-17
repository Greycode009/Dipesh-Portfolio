import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '@/config/database';

export class Project extends Model<
  InferAttributes<Project>,
  InferCreationAttributes<Project>
> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare title: string;
  declare description: string;
  declare technologies: string[];
  /** Optional: a backend or CLI project usually has nothing to screenshot. */
  declare image: CreationOptional<string | null>;
  declare githubUrl: string;
  /** Optional: not everything has somewhere to click through to. */
  declare liveUrl: CreationOptional<string | null>;
  declare type: CreationOptional<
    'frontend' | 'backend' | 'fullstack' | 'mobile' | 'other'
  >;
  declare featured: CreationOptional<boolean>;
  declare category: string;
  declare date: string;
  declare sortOrder: CreationOptional<number>;
  declare status: CreationOptional<'draft' | 'published'>;

  // Placement of this project's arcade cabinet in the pixel room.
  declare worldX: CreationOptional<number>;
  declare worldY: CreationOptional<number>;
  declare sprite: CreationOptional<string>;

  // Synced from GitHub rather than entered by hand.
  declare githubStars: CreationOptional<number | null>;
  declare lastCommitAt: CreationOptional<Date | null>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Project.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    // JSON rather than ARRAY so the same model runs on SQLite and Postgres.
    technologies: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    image: { type: DataTypes.STRING(1024), allowNull: true },
    githubUrl: { type: DataTypes.STRING(1024), allowNull: false },
    liveUrl: { type: DataTypes.STRING(1024), allowNull: true },
    type: {
      type: DataTypes.ENUM('frontend', 'backend', 'fullstack', 'mobile', 'other'),
      allowNull: false,
      defaultValue: 'frontend',
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    category: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'draft',
    },
    worldX: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    worldY: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    sprite: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'cabinet-default',
    },
    githubStars: { type: DataTypes.INTEGER, allowNull: true },
    lastCommitAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'projects' },
);
