const { project, userSkill, user, skill } = require("../db/models");
const {
  getAllContributions,
  createContribution,
} = require("../repositories/contributionsRepository");

module.exports = {
  async getAllContributions({ query }, res) {
    const { projectId, userId } = query;
    const options = {
      include: [
        { model: project },
        {
          model: userSkill,
          where: {},
          include: [{ model: user, where: {} }, { model: skill }],
        },
      ],
      where: {},
    };

    if (projectId) {
      console.log(projectId);
      options.where.projectId = projectId;
    }

    if (userId) {
      options.include[1].include[0].where.id = userId;
    }

    const contributions = await getAllContributions(options);
    return res.json(contributions);
  },

  async createContribution(req, res) {
    const newContribution = await createContribution({ ...req.body });
    return res.json(newContribution);
  },
};
