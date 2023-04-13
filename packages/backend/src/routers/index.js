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
const fundingsRouter = require("./fundingsRouter");
const contributionsRouter = require("./contributionsRouter");

const stripeWebHookRouter = require("./stripeWebHookRouter");

const appRouter = express.Router();

appRouter.use("/categories", categoriesRouter);
appRouter.use("/bankAccounts", bankAccountsRouter);
appRouter.use("/users", usersRouter);
appRouter.use("/pitchSlides", pitchSlidesRouter);
appRouter.use("/projects", projectsRouter);
appRouter.use("/skills", skillsRouter);
appRouter.use("/userSkills", userSkillsRouter);
appRouter.use("/requiredSkills", requiredSkillsRouter);
appRouter.use("/fundings", fundingsRouter);
appRouter.use("/contributions", contributionsRouter);

appRouter.use("/stripe-webhook", stripeWebHookRouter);

module.exports = appRouter;
