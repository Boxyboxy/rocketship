const express = require("express");

const skillsController = require("../controllers/skillsController");

const skillsRouter = express.Router();

skillsRouter.get("/", skillsController.getAllSkills);

skillsRouter.get("/:id", skillsController.getSkillById);

module.exports = skillsRouter;
