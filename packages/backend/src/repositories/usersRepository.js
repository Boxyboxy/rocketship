const { user, skill, project } = require("../db/models");
const {
  createUserSkills,
  deleteUserSkills,
} = require("../repositories/userSkillsRepository");
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
  async updateUserById(id, payload, skillIdArray) {
    // eslint-disable-next-line no-unused-vars
    const [_, [updatedUser]] = await user.update(
      { ...payload, updated_at: new Date() },
      // the model is returned when returning:true is specified
      {
        where: { id },
        returning: true,
      }
    );

    const userSkillsCreated = await createUserSkills(id, skillIdArray);

    const response = {
      ...updatedUser.toJSON(),
      newUserSkills: userSkillsCreated,
    };

    return response;
  },
  async createUser(payload) {
    const { skillIdArray, ...rest } = payload;
    const currentDate = new Date();
    const newUser = await user.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate,
    });
    const newUserJson = newUser.toJSON();

    const userSkillsCreated = await createUserSkills(
      newUserJson.id,
      skillIdArray
    );

    const response = {
      ...newUserJson,
      skills: userSkillsCreated,
    };

    return response;
  },

  async deleteUser(id) {
    deleteUserSkills(id);
    return user.destroy({
      where: {
        id: id,
      },
    });
  },
};
