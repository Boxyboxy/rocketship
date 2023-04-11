const { pitchSlide, category, skill } = require("../db/models");
const {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject,
  getProjectsCount,
} = require("../repositories/projectsRepository");
const { Sequelize } = require("sequelize");
const { skillsIdMap } = require("../configs/data");
module.exports = {
  async getAllProjects({ query }, res) {
    const { projectName, categoryName } = query;
    const options = {
      include: [
        { model: pitchSlide },
        { model: category, where: {} },
        { model: skill },
      ],
      where: {},
    };

    if (projectName) {
      options.where.name = Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("project.name")),
        "LIKE",
        `%${projectName.toLowerCase()}%`
      );
    }

    if (categoryName) {
      const actualCategoryName = categoryName.replace("%20", " ");
      options.include[1].where.name = actualCategoryName;
    }

    const projects = await getAllProjects(options);

    return res.json(projects);
  },
  async getProjectById(req, res) {
    const { id } = req.params;

    // +id converts a string to number
    if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
      const error = new Error("Project Id must be a valid number");
      error.status = 400;
      throw error;
    }

    const project = await getProjectById(id);
    if (!project) {
      const error = new Error(`Could not find project with project id ${id}`);
      error.status = 400;
      throw error;
    }

    return res.json(project);
  },

  async createProject(req, res) {
    const { requiredSkills, ...payload } = { ...req.body };
    const skillIdArray = requiredSkills.map(
      (requiredSkill) => skillsIdMap[requiredSkill]
    );
    console.log(skillIdArray);

    const newProject = await createProject({
      ...payload,
      skillIdArray,
    });

    return res.json(newProject);
  },

  async deleteProject(req, res) {
    const { id } = req.params;
    const deleteResult = await deleteProject(id);

    if (!deleteResult) {
      const error = new Error(`Could not delete project with project ID ${id}`);
      error.status = 400;
      throw error;
    }

    res.json({ success: true });
  },

  async getProjectsCount(req, res) {
    const count = await getProjectsCount();
    return res.json(count);
  },
};
