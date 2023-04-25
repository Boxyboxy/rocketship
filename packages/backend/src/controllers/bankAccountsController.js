const {
  getAllBankAccounts,
  getBankAccountById,
} = require("../repositories/bankAccountsRepository");

module.exports = {
  async getAllBankAccounts(req, res) {
    try {
      const bankAccounts = await getAllBankAccounts();

      return res.json(bankAccounts);
    } catch (err) {
      console.error(err);
    }
  },
  async getBankAccountById(req, res) {
    try {
      const { id } = req.params;
      // +id converts a string to number
      if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
        const error = new Error("Bank Account Id must be a valid number");
        error.status = 401;
        throw error;
      }

      const bankAccount = await getBankAccountById(id);
      if (!bankAccount) {
        const error = new Error(
          `Could not find bank account with bank account id ${id}`
        );
        error.status = 401;
        throw error;
      }

      return res.json(bankAccount);
    } catch (err) {
      console.error(err);
    }
  },
};
