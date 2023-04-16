const { funding } = require("../db/models");
const logger = require("../middleware/logger");
const { Op } = require("sequelize");

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

  async sumAllFundings() {
    return funding.sum("amount");
  },

  async sumFundingsByProjectId(projectId) {
    return funding.sum("amount", {
      where: { projectId: { [Op.eq]: projectId } },
    });
  },

  async getUniqueBackersByProjectId(options) {
    return funding.count(options);
  },
};
