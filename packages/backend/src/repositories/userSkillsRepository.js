const { userSkill } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  getAllUserSkills(options) {
    return userSkill.findAll(options);
  },
};
