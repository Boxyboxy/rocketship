"use strict";
const userSkills = require("./user-skills.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const currentDate = new Date();

    return queryInterface.bulkInsert(
      "user_skills",
      userSkills.map(({ skill_id, user_id }) => ({
        skill_id,
        user_id,
        created_at: currentDate,
        updated_at: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_skills");
  },
};
