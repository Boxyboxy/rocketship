const { bankAccount } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  getAllBankAccounts() {
    return bankAccount.findAll();
  },

  getBankAccountById(id) {
    const options = {};
    if (id) options.where = { id: id };
    return bankAccount.findOne(options);
  },
};
