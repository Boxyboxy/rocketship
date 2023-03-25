const express = require("express");

const requiredSkillsController = require("../controllers/requiredSkillsController");

const requiredSkillsRouter = express.Router();

requiredSkillsRouter.get(
  "/:id",
  requiredSkillsController.getAllRequiredSkillsByProjectId
);

module.exports = requiredSkillsRouter;
