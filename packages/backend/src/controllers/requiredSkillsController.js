const {
  getAllRequiredSkillsByProjectId,
} = require("../repositories/skillsRepository");

module.exports = {
  async getAllRequiredSkillsByProjectId(req, res) {
    const { id } = req.params;

    // +id converts a string to number
    if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
      const error = new Error("Project Id must be a valid number");
      error.status = 400;
      throw error;
    }

    const requiredSkills = await getAllRequiredSkillsByProjectId(id);
    if (!requiredSkills) {
      const error = new Error(
        `Could not find required skills with project id ${id}`
      );
      error.status = 400;
      throw error;
    }

    return res.json(requiredSkills);
  },
};
