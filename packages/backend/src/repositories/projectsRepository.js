const { project } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  getAllProjects() {
    return project.findAll();
  },

  getProjectById(id) {
    const options = {};
    if (id) options.where = { id: id };
    return project.findOne(options);
  },

  async createProject(payload) {
    const currentDate = new Date();
    const { urlString, ...rest } = payload;

    const newProject = await project.create({
      ...rest,
      created_at: currentDate,
      updated_at: currentDate,
    });
    const newProjectJson = newProject.toJSON();
    const newProjectImage = await projectImage.create({
      urlString: urlString,
      projectId: newProjectJson.id,
      created_at: currentDate,
      updated_at: currentDate,
    });

    const response = { ...newProjectJson, projectImages: [newProjectImage] };

    return response;
  },
  async deleteProject(id) {
    // await deleteProjectImageByProjectId(id);

    return project.destroy({
      where: {
        id: id,
      },
    });
  },
};
