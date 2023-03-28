"use strict";
const fundings = require("./fundings.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const currentDate = new Date();
    return queryInterface.bulkInsert(
      "fundings",
      fundings.map(({ amount, project_id, user_id, incentive, equity }) => ({
        amount: amount,
        project_id: project_id,
        user_id: user_id,
        incentive: incentive,
        equity: equity,
        created_at: currentDate,
        updated_at: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("fundings");
  },
};
