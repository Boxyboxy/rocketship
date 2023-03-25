"use strict";
const skills = require("./skills.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const currentDate = new Date();

    return queryInterface.bulkInsert(
      "skills",
      skills.map(({ skill }) => ({
        skill,
        created_at: currentDate,
        updated_at: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("skills");
  },
};
