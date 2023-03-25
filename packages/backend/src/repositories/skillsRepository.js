const { skill } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  getAllSkills() {
    return skill.findAll();
  },

  getSkillById(id) {
    const options = {};
    if (id) options.where = { id: id };
    return skill.findOne(options);
  },
};
