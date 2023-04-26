const { project, skill, requiredSkill } = require("../db/models");

const {
  getAllRequiredSkills,
  createRequiredSkill,
} = require("../repositories/requiredSkillsRepository");

module.exports = {
  async getAllRequiredSkills({ query }, res) {
    try {
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
    } catch (err) {
      console.error(err);
    }
  },

  async createRequiredSkill(req, res) {
    try {
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
    } catch (err) {
      console.error(err);
    }
  },

  async deleteRequiredSkillsByProjectId({ query }, res) {
    try {
      const { projectId } = req.params;
      const deleteResult = await deleteProject(id);

      if (!deleteResult) {
        const error = new Error(
          `Could not delete project with project ID ${id}`
        );
        error.status = 400;
        throw error;
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
    }
  },
};
