const { pitchSlide, category, skill } = require("../db/models");
const {
  getAllProjects,
  getProjectById,
  createProject,
  deleteProject,
  getProjectsCount,
  updateProjectById,
} = require("../repositories/projectsRepository");
const { Sequelize } = require("sequelize");
const { skillsIdMap } = require("../configs/data");
const { createBankAccount } = require("../repositories/bankAccountsRepository");
const {
  deleteRequiredSkillsByProjectId,
  createRequiredSkills,
} = require("../repositories/requiredSkillsRepository");
const {
  deletePitchSlidesByProjectId,
} = require("../repositories/pitchSlidesRepository");

module.exports = {
  async getAllProjects({ query }, res) {
    try {
      const { projectName, categoryName, sortBy, order } = query;
      const options = {
        include: [
          { model: pitchSlide },
          { model: category, where: {} },
          { model: skill },
        ],
        attributes: {},

        where: {},
        order: [],
      };

      if (projectName) {
        options.where.name = Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("project.name")),
          "LIKE",
          `%${projectName.toLowerCase()}%`
        );
      }

      if (categoryName) {
        const actualCategoryName = categoryName.replace("%20", " ");
        options.include[1].where.name = actualCategoryName;
      }

      if (sortBy && order) {
        if (sortBy == "date") {
          options.order[0] = ["createdAt", order];
        }

        if (sortBy == "funding") {
          options.attributes = {
            include: [
              [
                Sequelize.literal(`(
              SELECT coalesce(SUM(amount),0) FROM fundings WHERE fundings.project_id = project.id
  
            )`),
                "totalRaised",
              ],
            ],
          };

          options.order[0] = ["totalRaised", order];
        }
      }

      const projects = await getAllProjects(options);

      return res.json(projects);
    } catch (err) {
      console.error(err);
    }
  },
  async getProjectById(req, res) {
    try {
      const { id } = req.params;

      // +id converts a string to number
      if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
        const error = new Error("Project Id must be a valid number");
        error.status = 400;
        throw error;
      }

      const project = await getProjectById(id);
      if (!project) {
        const error = new Error(`Could not find project with project id ${id}`);
        error.status = 400;
        throw error;
      }

      return res.json(project);
    } catch (err) {
      console.error(err);
    }
  },

  async createProject(req, res) {
    try {
      const { requiredSkills, ...payload } = { ...req.body };
      const skillIdArray = requiredSkills.map(
        (requiredSkill) => skillsIdMap[requiredSkill]
      );
      console.log(skillIdArray);

      const newProject = await createProject({
        ...payload,
        skillIdArray,
      });

      return res.json(newProject);
    } catch (err) {
      console.error(err);
    }
  },

  async deleteProject(req, res) {
    try {
    } catch (err) {
      console.error(err);
    }
    const { id } = req.params;
    const deleteResult = await deleteProject(id);

    if (!deleteResult) {
      const error = new Error(`Could not delete project with project ID ${id}`);
      error.status = 400;
      throw error;
    }

    res.json({ success: true });
  },

  async getProjectsCount(req, res) {
    try {
      const count = await getProjectsCount();
      return res.json(count);
    } catch (err) {
      console.error(err);
    }
  },

  async updateProjectById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
        const error = new Error("id  must be a valid number");
        error.status = 400;
        throw error;
      }

      const {
        bankAccountNumber,
        bank,
        pitchSlidesUrlStrings,
        requiredSkills,
        ...rest
      } = req.body;

      let updatedProject = {};
      if (bankAccountNumber && bank) {
        const newBankAccount = await createBankAccount({
          bankAccountNumber: bankAccountNumber,
          bank: bank,
        });
        updatedProject = await updateProjectById(id, {
          ...rest,
          bankAccountId: newBankAccount.dataValues.id,
        });
      } else {
        updatedProject = await updateProjectById(id, {
          ...rest,
        });
      }

      console.log(updatedProject.dataValues);

      const response = {
        ...updatedProject.dataValues,
      };

      console.log(response);

      if (requiredSkills) {
        console.log("update required skills called");
        const skillIdArray = requiredSkills.map(
          (requiredSkill) => skillsIdMap[requiredSkill]
        );
        await deleteRequiredSkillsByProjectId(id);
        const requiredSkillsCreated = await createRequiredSkills(
          id,
          skillIdArray
        );
        response.requiredSkillsUpdated = requiredSkillsCreated;
      }
      if (pitchSlidesUrlStrings) {
        await deletePitchSlidesByProjectId(id);
        const pitchSlides = [];

        for (const url of pitchSlidesUrlStrings) {
          console.log(url);
          const newPitchSlide = await pitchSlide.create({
            urlString: url,
            projectId: id,
            createdAt: currentDate,
            updatedAt: currentDate,
          });
          pitchSlides.push(newPitchSlide);
        }
        response.pitchSlides = pitchSlides;
      }
      return res.json(response);
    } catch (err) {
      console.error(err);
    }
  },
};
