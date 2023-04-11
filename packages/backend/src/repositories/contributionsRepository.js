const { contribution } = require("../db/models");
const logger = require("../middleware/logger");
const { Op } = require("sequelize");

module.exports = {
  getAllContributions() {
    return contribution.findAll();
  },

  async createContribution(payload) {
    const currentDate = new Date();

    return contribution.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate,
    });
  },
};
