const { project, user } = require("../db/models");
const {
  getAllFundings,
  createFunding,
} = require("../repositories/fundingRepository");

module.exports = {
  async getAllFundings({ query }, res) {
    const { projectId, userId } = query;
    const options = {
      include: [
        { model: project, where: {} },
        { model: user, where: {} },
      ],
    };

    if (projectId) {
      options.include[0].where.id = projectId;
    }

    if (userId) {
      options.include[1].where.id = userId;
    }

    const fundings = await getAllFundings(options);
    return res.json(fundings);
  },

  async createFunding(req, res) {
    const newFunding = await createFunding({ ...req.body });

    return res.json(newFunding);
  },
};
