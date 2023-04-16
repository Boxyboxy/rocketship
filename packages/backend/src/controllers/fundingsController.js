const { project, user, category } = require("../db/models");
const Sequelize = require("sequelize");

const {
  getAllFundings,
  createFunding,
  sumAllFundings,
  sumFundingsByProjectId,
  getUniqueBackersByProjectId,
} = require("../repositories/fundingRepository");
const { getProjectById } = require("../repositories/projectsRepository");

module.exports = {
  async getAllFundings({ query }, res) {
    const { projectId, userId } = query;
    const options = {
      include: [
        { model: project, include: [{ model: category }], where: {} },
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
  async sumAllFundings(req, res) {
    const sum = await sumAllFundings();
    return res.json(sum);
  },
  async sumFundingsByProjectId(req, res) {
    const { projectId } = req.params;

    if (
      isNaN(projectId) ||
      +projectId > Number.MAX_SAFE_INTEGER ||
      +projectId < 0
    ) {
      const error = new Error("Project Id must be a valid number");
      error.status = 400;
      throw error;
    }
    const project = await getProjectById(projectId);
    if (!project) {
      const error = new Error(
        `Project with project id ${projectId} does not exist`
      );
      error.status = 400;
      throw error;
    }

    const sum = await sumFundingsByProjectId(projectId);
    if (!sum) {
      return res.json("0");
    }

    return res.json(sum);
  },

  // FOR PERSONAL TESTING
  async getUniqueBackersByProjectId({ query }, res) {
    const { projectId } = query;
    const options = {
      include: [{ model: project, include: [{ model: category }], where: {} }],
      attributes: [
        [Sequelize.literal("COUNT(DISTINCT funding.user_id)"), "uniqueBackers"],
      ],
      group: ["project.id", "project->category.id"],
    };

    if (projectId) {
      options.include[0].where.id = projectId;
    }
    const backers = await getUniqueBackersByProjectId(options);
    return res.json(backers[0]);
  },
};
