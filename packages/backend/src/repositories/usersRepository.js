const { user, skill, project, userSkill } = require("../db/models");

const logger = require("../middleware/logger");
module.exports = {
  getAllUsers(options) {
    return user.findAll(options);
  },

  getUserById(id) {
    const options = {
      include: [
        { model: skill },
        {
          model: project,
        },
      ],
      where: {},
    };
    if (id) options.where = { id };
    return user.findOne(options);
  },
  async updateUserById(id, payload) {
    // eslint-disable-next-line no-unused-vars
    const [_, [updatedUser]] = await user.update(
      { ...payload, updated_at: new Date() },
      // the model is returned when returning:true is specified
      { where: { id }, returning: true }
    );

    return updatedUser;
  },
  async createUser(payload) {
    const { userSkills, ...rest } = payload;
    const currentDate = new Date();
    const newUser = await user.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate,
    });
    const newUserJson = newUser.toJSON();
    const skills = [];
    for (const skillId of userSkills) {
      const newUserSkill = await userSkill.create({
        skillId: skillId,
        userId: newUserJson.id,
        created_at: currentDate,
        updated_at: currentDate,
      });
      skills.push(newUserSkill);
    }
    const response = {
      ...newUserJson,
      skills: skills,
    };

    return response;
  },
};
