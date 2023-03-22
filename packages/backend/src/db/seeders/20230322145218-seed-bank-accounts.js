"use strict";
const bankAccounts = require("./bank-accounts.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const currentDate = new Date();

    return queryInterface.bulkInsert(
      "bank_accounts",
      bankAccounts.map(({ bank_account_number, bank }) => ({
        bank_account_number: bank_account_number,
        bank: bank,
        created_at: currentDate,
        updated_at: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("bank_accounts", null, {});
  },
};
