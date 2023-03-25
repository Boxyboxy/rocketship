const { skill, user } = require("../db/models");
const { getAllUserSkills } = require("../repositories/userSkillsRepository");

module.exports = {
  async getAllUserSkills({ query }, res) {
    const { skillId, userId } = query;
    const options = {
      include: [{ model: skill }, { model: user, where: {} }],
      where: {},
    };
    if (skillId) {
      options.include[0].id = skillId;
    }

    if (userId) {
      options.include[1].id = userId;
    }
    const userSkills = await getAllUserSkills(options);
    return res.json(userSkills);
  },
};
