"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.project);
      this.hasMany(models.userSkill);
      this.belongsToMany(models.skill, { through: models.userSkill });
      this.hasMany(models.funding);
    }
  }
  user.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      mobile: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      linkedinUrl: DataTypes.STRING,
      githubUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
      underscored: true,
    }
  );
  return user;
};
