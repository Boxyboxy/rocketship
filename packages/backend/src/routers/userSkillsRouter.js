const express = require("express");

const userSkillsController = require("../controllers/userSkillsController");

const userSkillsRouter = express.Router();

userSkillsRouter.get("/", userSkillsController.getAllUserSkills);

module.exports = userSkillsRouter;
