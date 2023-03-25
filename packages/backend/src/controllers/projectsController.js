const {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject,
} = require("../repositories/projectsRepository");

module.exports = {
  async getAllProjects(req, res) {
    const projects = await getAllProjects();

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
    const newProject = await createProject({ ...req.body });

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
};
