"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pitchSlide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.project);
    }
  }
  pitchSlide.init(
    {
      projectId: DataTypes.INTEGER,
      urlString: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "pitchSlide",
      underscored: true,
    }
  );
  return pitchSlide;
};
