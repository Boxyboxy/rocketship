const { bankAccount } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  getAllBankAccounts() {
    return bank_account.findAll();
  },

  getBankAccountById(id) {
    const options = {};
    if (id) options.where = { id: id };
    return bank_account.findOne(options);
  },
};
