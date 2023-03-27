const {
  getAllUsers,
  getUserById,
  updateUserById,
  createUser,
  deleteUser,
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
    const { newSkills, ...rest } = req.body;
    const skillIdArray = newSkills.map((skill) => skillsIdMap[skill]);

    const updatedUser = await updateUserById(id, rest, skillIdArray);

    return res.json(updatedUser);
  },
  async createUser(req, res) {
    const { skills, ...payload } = { ...req.body };

    const skillIdArray = skills.map((skill) => skillsIdMap[skill]);
    console.log(skillIdArray);

    const newUser = await createUser({
      ...payload,
      skillIdArray: skillIdArray,
    });

    return res.json(newUser);
  },
  async deleteUser(req, res) {
    const { id } = req.params;
    const deleteResult = await deleteUser(id);

    if (!deleteResult) {
      const error = new Error(`Could not delete user with user ID ${id}`);
      error.status = 400;
      throw error;
    }

    res.json({ success: true });
  },
};
