"use strict";
const users = require("./users.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const currentDate = new Date();

    return queryInterface.bulkInsert(
      "users",
      users.map(({ name, mobile, email, linkedin, github }) => ({
        name: name,
        mobile: mobile,
        email: email,
        linkedin_url: linkedin,
        github_url: github,
        created_at: currentDate,
        updated_at: currentDate,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users");
  },
};
