"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "categories",
          key: "id",
        },
      },
      owner_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      summary: {
        type: Sequelize.TEXT,
      },
      details: {
        type: Sequelize.TEXT,
      },
      bank_account_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "bank_accounts",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM("active", "completed", "cancelled"),
      },
      location: {
        type: Sequelize.STRING,
      },
      github_repo_url: {
        type: Sequelize.STRING,
        validate: {
          isUrl: true,
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("projects");
  },
};
