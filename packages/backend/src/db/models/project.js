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
      this.hasMany(models.pitchSlide);
      this.belongsTo(models.bankAccount);
      this.belongsTo(models.user);
      this.belongsToMany(models.skill, {
        through: models.requiredSkill,
      });
    }
  }
  project.init(
    {
      name: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      coverImage: DataTypes.STRING,
      summary: DataTypes.STRING,
      details: DataTypes.STRING,
      bankAccountId: DataTypes.INTEGER,
      status: DataTypes.ENUM("active", "completed", "cancelled"),
      location: DataTypes.STRING,
      githubRepoUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "project",
      underscored: true,
    }
  );
  return project;
};
