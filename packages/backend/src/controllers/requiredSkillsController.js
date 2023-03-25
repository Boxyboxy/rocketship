const { project, skill, requiredSkill } = require("../db/models");

const {
  getAllRequiredSkills,
  createRequiredSkill,
} = require("../repositories/requiredSkillsRepository");

module.exports = {
  async getAllRequiredSkills({ query }, res) {
    const { projectId, skillId } = query;
    const options = {
      include: [
        { model: project, where: {} },
        { model: skill, where: {} },
      ],
    };

    if (projectId) {
      options.include[0].where.id = projectId;
    }
    if (skillId) {
      options.include[1].where.id = skillId;
    }
    const userSkills = await getAllRequiredSkills(options);

    return res.json(userSkills);
  },

  async createRequiredSkill(req, res) {
    const { projectId, skillId } = { ...req.body };

    const requiredSkills = await requiredSkill.findAll({
      where: { projectId: projectId, skillId: skillId },
    });
    // Error will be thrown if the same skill is already indicated as required in the
    if (requiredSkills.length > 0) {
      const error = new Error(
        "Skill already indicated as required for project"
      );
      error.status = 400;
      throw error;
    }

    const newRequiredSkill = await createRequiredSkill({ ...req.body });

    return res.json(newRequiredSkill);
  },
  //TODO:  can you do a post with a query param?
  async createRequiredSkills(req, res) {
    const { projectId } = req.params;
    console.log();
    const { skillIdArray } = { ...req.body };
    // +projectId converts a string to number
    if (
      isNaN(projectId) ||
      +projectId > Number.MAX_SAFE_INTEGER ||
      +projectId < 0
    ) {
      const error = new Error("Project Id must be a valid number");
      error.status = 400;
      throw error;
    }

    const requiredSkills = await requiredSkill.findAll({
      where: { projectId: projectId },
    });
    console.log(requiredSkills);
    return res.json(requiredSkills);
  },
};
