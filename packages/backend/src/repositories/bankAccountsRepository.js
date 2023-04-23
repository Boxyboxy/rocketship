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

  async createBankAccount(payload) {
    const currentDate = new Date();

    return contribution.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate,
    });
  },
};
