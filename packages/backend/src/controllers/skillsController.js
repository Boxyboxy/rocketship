const {
  getAllSkills,
  getSkillById,
} = require("../repositories/skillsRepository");

module.exports = {
  async getAllSkills(req, res) {
    const skills = await getAllSkills();

    return res.json(skills);
  },
  async getSkillById(req, res) {
    const { id } = req.params;

    // +id converts a string to number
    if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
      const error = new Error("Skill Id must be a valid number");
      error.status = 400;
      throw error;
    }

    const skill = await getSkillById(id);
    if (!skill) {
      const error = new Error(`Could not find skill with skill id ${id}`);
      error.status = 400;
      throw error;
    }

    return res.json(skill);
  },
};
