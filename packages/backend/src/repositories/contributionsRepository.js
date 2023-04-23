const { contribution } = require("../db/models");
const logger = require("../middleware/logger");
const { Op } = require("sequelize");

module.exports = {
  async getAllContributions(options) {
    return contribution.findAll(options);
  },

  async createContribution(payload) {
    const currentDate = new Date();

    return contribution.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate,
    });
  },

  async updateContributionById(id, payload) {
    // eslint-disable-next-line no-unused-vars
    const [_, [updatedContribution]] = await contribution.update(
      { ...payload, updated_at: new Date() },
      // the model is returned when returning:true is specified
      {
        where: { id },
        returning: true,
      }
    );

    const response = updatedContribution.toJSON();

    return response;
  },
};
