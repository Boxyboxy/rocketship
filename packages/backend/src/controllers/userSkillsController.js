const { skill, user } = require("../db/models");
const { getAllUserSkills } = require("../repositories/userSkillsRepository");

module.exports = {
  async getAllUserSkills({ query }, res) {
    try {
      const { skillId, userId } = query;
      const options = {
        include: [
          { model: skill, where: {} },
          { model: user, where: {} },
        ],
        where: {},
      };
      if (skillId) {
        options.include[0].where.id = skillId;
      }

      if (userId) {
        options.include[1].where.id = userId;
      }
      const userSkills = await getAllUserSkills(options);
      return res.json(userSkills);
    } catch (err) {
      console.error(err);
    }
  },
};
