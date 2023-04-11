"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userSkill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user);
      this.belongsTo(models.skill);
      this.hasOne(models.contribution);
    }
  }
  userSkill.init(
    {
      skillId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "userSkill",
      underscored: true,
    }
  );
  return userSkill;
};
