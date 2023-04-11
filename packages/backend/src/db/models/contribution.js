"use strict";
const { userSkill } = require("../models");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class contribution extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.project);
      this.belongsTo(models.userSkill);
    }
  }
  contribution.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projectId: DataTypes.INTEGER,
      userSkillId: {
        type: DataTypes.INTEGER,
        references: {
          model: userSkill,
          key: "id",
        },
      },
      status: DataTypes.ENUM("pending", "accepted", "cancelled"),
      message: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "contribution",
      underscored: true,
    }
  );
  return contribution;
};
