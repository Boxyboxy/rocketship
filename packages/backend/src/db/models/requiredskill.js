"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class requiredSkill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.project);
      this.belongsTo(models.skill);
    }
  }
  requiredSkill.init(
    {
      skillId: DataTypes.INTEGER,
      projectId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "requiredSkill",
      underscored: true,
    }
  );
  return requiredSkill;
};
