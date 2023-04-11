const { project } = require("../db/models");
const {
  getAllContributions,
  createContribution,
} = require("../repositories/contributionsRepository");

module.exports = {
  async getAllContributions(req, res) {
    const contributions = await getAllContributions();
    return res.json(contributions);
  },

  async createContribution(req, res) {
    const newContribution = await createContribution({ ...req.body });
    return res.json(newContribution);
  },
};
