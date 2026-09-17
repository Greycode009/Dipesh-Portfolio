import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '@/config/database';

/** Messages left on the in-world signboard. Hidden until approved. */
export class GuestbookEntry extends Model<
  InferAttributes<GuestbookEntry>,
  InferCreationAttributes<GuestbookEntry>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare message: string;
  declare approved: CreationOptional<boolean>;
  /** Hashed, not stored raw — only used to rate-limit repeat posters. */
  declare authorHash: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

GuestbookEntry.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    message: { type: DataTypes.STRING(280), allowNull: false },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    authorHash: { type: DataTypes.STRING(64), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'guestbook_entries' },
);
