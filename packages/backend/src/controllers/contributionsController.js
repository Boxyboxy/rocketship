const { project, userSkill, user, skill } = require("../db/models");
const {
  getAllContributions,
  createContribution,
} = require("../repositories/contributionsRepository");

module.exports = {
  async getAllContributions(query, res) {
    const { projectId, userSkillId } = query;
    const options = {
      include: [
        { model: project, where: {} },
        {
          model: userSkill,
          where: {},
          include: [{ model: user }, { model: skill }],
        },
      ],
    };

    if (projectId) {
      options.include[0].where.id = projectId;
    }

    if (userSkillId) {
      options.include[1].where.id = userSkillId;
    }

    const contributions = await getAllContributions(options);
    return res.json(contributions);
  },

  async createContribution(req, res) {
    const newContribution = await createContribution({ ...req.body });
    return res.json(newContribution);
  },
};
