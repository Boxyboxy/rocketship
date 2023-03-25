const express = require("express");

const requiredSkillsController = require("../controllers/requiredSkillsController");

const requiredSkillsRouter = express.Router();

requiredSkillsRouter.get("/", requiredSkillsController.getAllRequiredSkills);

requiredSkillsRouter.post("/", requiredSkillsController.createRequiredSkill);
requiredSkillsRouter.post(
  "/projectId",
  requiredSkillsController.createRequiredSkills
);

module.exports = requiredSkillsRouter;
