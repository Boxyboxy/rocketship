require("express-async-errors");
const express = require("express");

const categoriesRouter = require("./categoriesRouter");
const bankAccountsRouter = require("./bankAccountsRouter");
const usersRouter = require("./usersRouter");
const pitchSlidesRouter = require("./pitchSlidesRouter");
const projectsRouter = require("./projectsRouter");
const skillsRouter = require("./skillsRouter");
const userSkillsRouter = require("./userSkillsRouter");
const requiredSkillsRouter = require("./requiredSkillsRouter");
const appRouter = express.Router();

appRouter.use("/categories", categoriesRouter);
appRouter.use("/bankAccounts", bankAccountsRouter);
appRouter.use("/users", usersRouter);
appRouter.use("/pitchSlides", pitchSlidesRouter);
appRouter.use("/projects", projectsRouter);
appRouter.use("/skills", skillsRouter);
appRouter.use("/userSkills", userSkillsRouter);
appRouter.use("/requiredSkills", requiredSkillsRouter);
module.exports = appRouter;
