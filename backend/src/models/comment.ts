import { DataTypes } from "sequelize";

export default {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  fatherCommentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
}