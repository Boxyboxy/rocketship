const { requiredSkill } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  getAllRequiredSkills(options) {
    return requiredSkill.findAll(options);
  },

  async createRequiredSkill(payload) {
    const currentDate = new Date();

    return requiredSkill.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate,
    });
  },
  deleteRequiredSkillsByProjectId(projectId) {
    return requiredSkill.destroy({
      where: {
        projectId: projectId,
      },
    });
  },
};
