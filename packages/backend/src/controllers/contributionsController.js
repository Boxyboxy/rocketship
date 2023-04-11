const { project, user } = require('../db/models');
const {
  getAllContributions,
  createContribution
} = require('../repositories/contributionRepository');
const { getProjectById } = require('../repositories/projectsRepository');

module.exports = {
  async getAllContributions({ query }, res) {
    const { projectId, userId } = query;
    const options = {
      include: [
        { model: project, where: {} },
        { model: user, where: {} }
      ]
    };

    if (projectId) {
      options.include[0].where.id = projectId;
    }

    if (userId) {
      options.include[1].where.id = userId;
    }

    const fundings = await getAllContributions(options);
    return res.json(fundings);
  },

  async createContribution(req, res) {
    const newFunding = await createContribution({ ...req.body });

    return res.json(newFunding);
  }
};
