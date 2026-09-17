import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '@/config/database';

/** A line in the public chat. Anonymous: no author is recorded at all. */
export class ChatMessage extends Model<
  InferAttributes<ChatMessage>,
  InferCreationAttributes<ChatMessage>
> {
  declare id: CreationOptional<number>;
  declare body: string;
  /** Hashed, never raw, and never sent to clients. Used for rate limiting. */
  declare authorHash: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  toJSON() {
    const { authorHash: _omit, ...rest } = super.toJSON() as Record<
      string,
      unknown
    >;
    return rest;
  }
}

ChatMessage.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    body: { type: DataTypes.STRING(240), allowNull: false },
    authorHash: { type: DataTypes.STRING(64), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'chat_messages' },
);
