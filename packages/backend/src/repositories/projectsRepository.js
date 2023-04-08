const { project } = require("../db/models");
const logger = require("../middleware/logger");
const { pitchSlide, requiredSkill } = require("../db/models");
const {
  deletePitchSlidesByProjectId,
} = require("../repositories/pitchSlidesRepository");
const {
  deleteRequiredSkillsByProjectId,
  createRequiredSkills,
} = require("../repositories/requiredSkillsRepository");
const { Op } = require("sequelize");
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
    const { pitchSlidesUrlStrings, skillIdArray, ...rest } = payload;
    console.log(rest);

    const newProject = await project.create({
      ...rest,
      created_at: currentDate,
      updated_at: currentDate,
    });

    const newProjectJson = newProject.toJSON();

    const pitchSlides = [];

    for (const url of pitchSlidesUrlStrings) {
      console.log(url);
      const newPitchSlide = await pitchSlide.create({
        urlString: url,
        projectId: newProjectJson.id,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
      pitchSlides.push(newPitchSlide);
    }

    const requiredSkillsCreated = await createRequiredSkills(
      newProjectJson.id,
      skillIdArray
    );

    const response = {
      ...newProjectJson,
      pitchSlides: pitchSlides,
      skills: requiredSkillsCreated,
    };

    return response;
  },
  async deleteProject(id) {
    await deletePitchSlidesByProjectId(id);

    await deleteRequiredSkillsByProjectId(id);

    return project.destroy({
      where: {
        id: id,
      },
    });
  },

  async getProjectsCount() {
    return project.count({
      where: {
        id: {
          [Op.gt]: 0,
        },
      },
    });
  },
};
