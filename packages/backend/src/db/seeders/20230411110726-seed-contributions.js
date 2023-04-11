"use strict";
const contributions = require("./contributions.json");

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
      "contributions",
      contributions.map(({ project_id, user_skill_id, status, message }) => ({
        project_id: project_id,
        user_skill_id: user_skill_id,
        status: status,
        message: message,
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
    await queryInterface.bulkDelete("contributions");
  },
};
