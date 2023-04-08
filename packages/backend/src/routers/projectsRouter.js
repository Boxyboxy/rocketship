const express = require("express");

const projectsController = require("../controllers/projectsController");
const authMiddleware = require("../middleware/auth");

const projectsRouter = express.Router();

projectsRouter.get("/", projectsController.getAllProjects);
projectsRouter.get("/count", projectsController.getProjectsCount);
projectsRouter.get("/:id", projectsController.getProjectById);
projectsRouter.post("/", projectsController.createProject);
projectsRouter.delete("/:id", projectsController.deleteProject);

module.exports = projectsRouter;
