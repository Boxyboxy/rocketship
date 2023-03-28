const { funding } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  getAllFundings(options) {
    return funding.findAll(options);
  },

  async createFunding(payload) {
    const currentDate = new Date();

    return funding.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate,
    });
  },
};
