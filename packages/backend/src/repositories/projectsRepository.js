const { project } = require("../db/models");
const logger = require("../middleware/logger");
const { pitchSlide, category, skill, bankAccount } = require("../db/models");
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
    const options = {
      include: [
        { model: pitchSlide },
        { model: category, where: {} },
        { model: skill },
      ],
    };
    if (id) options.where = { id: id };
    return project.findOne(options);
  },

  async createProject(payload) {
    const currentDate = new Date();
    const {
      bankAccountNumber,
      bank,
      pitchSlidesUrlStrings,
      skillIdArray,
      ...rest
    } = payload;

    const newBankAccount = await bankAccount.create({
      bankAccountNumber: bankAccountNumber,
      bank: bank,
      created_at: currentDate,
      updated_at: currentDate,
    });

    const newProject = await project.create({
      ...rest,
      bankAccountId: newBankAccount.dataValues.id,
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

  async updateProjectById(id, payload) {
    const [_, [updatedProject]] = await project.update(
      {
        ...payload,
        updated_at: new Date(),
      },
      // the model is returned when returning:true is specified
      {
        where: { id },
        returning: true,
      }
    );
    return updatedProject;
  },
};
