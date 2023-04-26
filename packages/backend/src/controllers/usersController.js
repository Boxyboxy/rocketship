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
    try {
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
    } catch (err) {
      console.error(err);
    }
  },
  async getUserById(req, res) {
    try {
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
    } catch (err) {
      console.error(err);
    }
  },
  async updateUserById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
        const error = new Error("id  must be a valid number");
        error.status = 400;
        throw error;
      }
      const { newSkills, ...rest } = req.body;

      if (
        !rest.name.includes(" ") ||
        rest.name.length < 3 ||
        rest.name.split(" ").length - 1 > 2
      ) {
        const error = new Error(
          "Please enter a full name with a space in between 2 words."
        );
        error.status = 411;
        throw error;
      }

      if (rest.mobile.length > 8 || !rest.mobile.match(/^\d{8}$/)) {
        const error = new Error(
          "Mobile number must be 8 digits. Please input only numbers."
        );
        error.status = 412;
        throw error;
      }

      if (!rest.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        const error = new Error("Please enter a valid email");
        error.status = 413;
        throw error;
      }

      if (
        rest.githubUrl.length < 2 ||
        !rest.githubUrl.includes(".") ||
        !rest.githubUrl.startsWith("http") ||
        !rest.githubUrl.includes("github")
      ) {
        const error = new Error("Github url is not valid");
        error.status = 414;
        throw error;
      }

      if (
        rest.linkedinUrl.length < 2 ||
        !rest.linkedinUrl.includes(".") ||
        !rest.linkedinUrl.startsWith("http") ||
        !rest.linkedinUrl.includes("linkedin")
      ) {
        const error = new Error("Linkedin url is not valid");
        error.status = 415;
        throw error;
      }
      const skillIdArray = newSkills.map((skill) => skillsIdMap[skill]);

      const updatedUser = await updateUserById(id, rest, skillIdArray);

      return res.json(updatedUser);
    } catch (err) {
      console.error(err);
    }
  },
  async createUser(req, res) {
    try {
      const { skills, ...rest } = { ...req.body };

      if (
        !rest.name.includes(" ") ||
        rest.name.length < 3 ||
        rest.name.split(" ").length - 1 > 2
      ) {
        const error = new Error(
          "Please enter a full name with a space in between 2 words."
        );
        error.status = 411;
        throw error;
      }

      if (rest.mobile.length > 8 || !rest.mobile.match(/^\d{8}$/)) {
        const error = new Error(
          "Mobile number must be 8 digits. Please input only numbers."
        );
        error.status = 412;
        throw error;
      }

      if (!rest.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        const error = new Error("Please enter a valid email");
        error.status = 413;
        throw error;
      }

      if (
        rest.githubUrl.length < 2 ||
        !rest.githubUrl.includes(".") ||
        !rest.githubUrl.startsWith("http") ||
        !rest.githubUrl.includes("github")
      ) {
        const error = new Error("Github url is not valid");
        error.status = 414;
        throw error;
      }

      if (
        rest.linkedinUrl.length < 2 ||
        !rest.linkedinUrl.includes(".") ||
        !rest.linkedinUrl.startsWith("http") ||
        !rest.linkedinUrl.includes("linkedin")
      ) {
        const error = new Error("Linkedin url is not valid");
        error.status = 415;
        throw error;
      }

      const skillIdArray = skills.map((skill) => skillsIdMap[skill]);

      const newUser = await createUser({
        ...rest,
        skillIdArray: skillIdArray,
      });

      return res.json(newUser);
    } catch (err) {
      console.error;
    }
  },
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deleteResult = await deleteUser(id);

      if (!deleteResult) {
        const error = new Error(`Could not delete user with user ID ${id}`);
        error.status = 400;
        throw error;
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
    }
  },
};
