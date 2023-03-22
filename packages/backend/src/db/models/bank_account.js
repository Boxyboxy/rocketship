"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bank_account extends Model {
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
  bank_account.init(
    {
      bank_account_number: DataTypes.STRING,
      bank: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "bank_account",
      underscored: true,
    }
  );
  return bank_account;
};
