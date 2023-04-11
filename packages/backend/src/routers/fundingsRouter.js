const express = require("express");

const fundingsController = require("../controllers/fundingsController");
const authMiddleware = require("../middleware/auth");

const fundingsRouter = express.Router();

fundingsRouter.get("/", fundingsController.getAllFundings);
fundingsRouter.post("/", fundingsController.createFunding);
fundingsRouter.get("/sumAll", fundingsController.sumAllFundings);
fundingsRouter.get(
  "/sum/:projectId",
  fundingsController.sumFundingsByProjectId
);
module.exports = fundingsRouter;
