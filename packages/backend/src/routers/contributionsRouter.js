const express = require("express");

const contributionsController = require("../controllers/contributionsController");
const authMiddleware = require("../middleware/auth");

const contributionsRouter = express.Router();

contributionsRouter.get("/", contributionsController.getAllContributions);
contributionsRouter.post("/", contributionsController.createContribution);
contributionsRouter.patch(
  "/:id",
  contributionsController.updateContributionById
);
module.exports = contributionsRouter;
