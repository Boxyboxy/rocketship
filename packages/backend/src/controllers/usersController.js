const {
  getAllUsers,
  getUserById,
  updateUserById,
  createUser,
} = require("../repositories/usersRepository");
const { skillsIdMap } = require("../configs/data.js");
const { Sequelize } = require("sequelize");
const skill = require("../db/models/skill");
module.exports = {
  async getAllUsers({ query }, res) {
    const { email, name } = query;

    const options = {
      where: {},
    };

    if (email) {
      options.where.email = email;
    }

    if (name)
      options.where.name = Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("name")),
        "LIKE",
        `%${name.toLowerCase()}%`
      );

    const users = await getAllUsers(options);

    return res.json(users);
  },
  async getUserById(req, res) {
    const { id } = req.params;
    // +id converts a string to number
    if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
      const error = new Error("id  must be a valid number");
      error.status = 400;
      throw error;
    }

    const user = await getUserById(id);

    if (!user) {
      const error = new Error(`Could not find user with id ${id}`);
      error.status = 400;
      throw error;
    }

    return res.json(user);
  },
  async updateUserById(req, res) {
    const { id } = req.params;
    if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
      const error = new Error("id  must be a valid number");
      error.status = 400;
      throw error;
    }
    const updatedUser = await updateUserById(id, req.body);
    return res.json(updatedUser);
  },
  async createUser(req, res) {
    const { skills, ...payload } = { ...req.body };

    const skillIdArray = skills.map((skill) => skillsIdMap[skill]);
    console.log(skillIdArray);

    const newUser = await createUser({ ...payload, userSkills: skillIdArray });

    return res.json(newUser);
  },
};
