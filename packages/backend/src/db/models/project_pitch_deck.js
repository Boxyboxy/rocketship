"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project_pitch_deck extends Model {
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
  project_pitch_deck.init(
    {
      project_id: DataTypes.INTEGER,
      url_string: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "project_pitch_deck",
      underscored: true,
    }
  );
  return project_pitch_deck;
};
