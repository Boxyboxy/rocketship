"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bankAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.project);
    }
  }
  bankAccount.init(
    {
      bankAccountNumber: DataTypes.STRING,
      bank: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "bankAccount",
      underscored: true,
    }
  );
  return bankAccount;
};
