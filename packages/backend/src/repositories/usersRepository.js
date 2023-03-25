const { user } = require("../db/models");

const logger = require("../middleware/logger");
module.exports = {
  getAllUsers(options) {
    return user.findAll(options);
  },

  getUserById(id) {
    const options = {
      include: [
        // { model: userAddress },
        // {
        //   model: order,
        //   include: { model: orderItem, include: { model: product } },
        // },
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
    const currentDate = new Date();
    const newUser = await user.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate,
    });
    return newUser;
  },
};
