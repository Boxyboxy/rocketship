"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.category);
      this.hasMany(models.project_pitch_decks);
      this.belongsTo(models.bank_account);
      this.belongsTo(models.user);
    }
  }
  project.init(
    {
      name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      owner_user_id: DataTypes.INTEGER,
      description: DataTypes.STRING,
      bank_account_id: DataTypes.INTEGER,
      status: DataTypes.ENUM("active", "completed", "cancelled"),
      location: DataTypes.STRING,
      github_repo_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "project",
      underscored: true,
    }
  );
  return project;
};
