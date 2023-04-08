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
  async createRequiredSkills(projectId, skillIdArray) {
    const currentDate = new Date();
    const requiredSkills = [];
    for (const skillId of skillIdArray) {
      const newRequiredSkill = await requiredSkill.create({
        projectId,
        skillId: skillId,
        created_at: currentDate,
        updated_at: currentDate,
      });
      requiredSkills.push(newRequiredSkill);
    }
    return requiredSkills;
  },
  deleteRequiredSkillsByProjectId(projectId) {
    return requiredSkill.destroy({
      where: {
        projectId: projectId,
      },
    });
  },
};
