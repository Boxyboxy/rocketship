const { userSkill } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  getAllUserSkills(options) {
    return userSkill.findAll(options);
  },

  async createUserSkills(userId, skillIdArray) {
    const currentDate = new Date();
    const skills = [];
    for (const skillId of skillIdArray) {
      const newUserSkill = await userSkill.create({
        userId: userId,
        skillId: skillId,
        created_at: currentDate,
        updated_at: currentDate,
      });
      skills.push(newUserSkill);
    }
    return skills;
  },

  async deleteUserSkills(userId) {
    return userSkill.destroy({
      where: {
        userId: userId,
      },
    });
  },
};
