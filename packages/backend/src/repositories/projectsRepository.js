const { project } = require("../db/models");
const logger = require("../middleware/logger");
const { pitchSlide, requiredSkill } = require("../db/models");
const {
  deletePitchSlidesByProjectId,
} = require("../repositories/pitchSlidesRepository");
const {
  deleteRequiredSkillsByProjectId,
} = require("../repositories/requiredSkillsRepository");
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
    const { pitchSlidesUrlStrings, requiredSkills, ...rest } = payload;
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
    const skills = [];
    for (skillId of requiredSkills) {
      const newRequiredSkill = await requiredSkill.create({
        skillId: skillId,
        projectId: newProjectJson.id,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
      skills.push(newRequiredSkill);
    }
    const response = {
      ...newProjectJson,
      pitchSlides: pitchSlides,
      skills: skills,
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
};
