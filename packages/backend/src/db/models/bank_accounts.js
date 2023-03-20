'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bank_accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bank_accounts.init({
    bank_account_number: DataTypes.STRING,
    bank: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'bank_accounts',
    underscored: true,
  });
  return bank_accounts;
};