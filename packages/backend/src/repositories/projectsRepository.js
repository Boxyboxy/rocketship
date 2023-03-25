const { project } = require("../db/models");
const logger = require("../middleware/logger");
const { pitchSlide } = require("../db/models");
module.exports = {
  getAllProjects(options) {
    return project.findAll(options);
  },

  getProjectById(id) {
    const options = {};
    if (id) options.where = { id: id };
    return project.findOne(options);
  },

  async createProject(payload) {
    const currentDate = new Date();
    const { url_strings, ...rest } = payload;
    console.log(rest);

    const newProject = await project.create({
      ...rest,
      created_at: currentDate,
      updated_at: currentDate,
    });

    const newProjectJson = newProject.toJSON();
    console.log(newProjectJson);
    const pitchSlides = [];

    for (const url of url_strings) {
      console.log(url);
      const newPitchSlide = await pitchSlide.create({
        urlString: url,
        projectId: newProjectJson.id,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
      pitchSlides.push(newPitchSlide);
    }

    const response = { ...newProjectJson, pitchSlides: pitchSlides };

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
