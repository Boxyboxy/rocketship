const { project, userSkill, user, skill } = require("../db/models");
const {
  getAllContributions,
  createContribution,
  updateContributionById,
} = require("../repositories/contributionsRepository");

module.exports = {
  async getAllContributions({ query }, res) {
    try {
      const { projectId, userId, status } = query;
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
      if (status) {
        options.where.status = status;
      }

      const contributions = await getAllContributions(options);
      return res.json(contributions);
    } catch (err) {
      console.error(err);
    }
  },

  async createContribution(req, res) {
    try {
      const newContribution = await createContribution({ ...req.body });
      return res.json(newContribution);
    } catch (err) {
      console.error(err);
    }
  },

  async updateContributionById(req, res) {
    try {
      const { id } = req.params;
      console.log(id);
      if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
        const error = new Error("id  must be a valid number");
        error.status = 400;
        throw error;
      }
      const payload = req.body;

      const updatedContribution = await updateContributionById(id, payload);

      return res.json(updatedContribution);
    } catch (err) {
      console.error(err);
    }
  },
};
