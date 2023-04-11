"use strict";
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
      this.belongsTo(models.project, { through: models.userSkill });
    }
  }
  contribution.init(
    {
      projectId: DataTypes.INTEGER,
      userSkillId: DataTypes.INTEGER,
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
