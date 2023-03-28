"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class funding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.project);
      this.belongsTo(models.user);
    }
  }
  funding.init(
    {
      amount: DataTypes.DECIMAL,
      projectId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      incentive: DataTypes.ENUM("membership", "equity"),
      equity: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "funding",
      underscored: true,
    }
  );
  return funding;
};
