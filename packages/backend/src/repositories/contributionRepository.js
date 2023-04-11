const { funding } = require('../db/models');
const logger = require('../middleware/logger');
const { Op } = require('sequelize');

module.exports = {
  getAllContributions(options) {
    return contribution.findAll(options);
  },

  async createContribution(payload) {
    const currentDate = new Date();

    return contribution.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate
    });
  }
};
