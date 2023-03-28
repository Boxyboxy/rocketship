const express = require("express");

const fundingsController = require("../controllers/fundingsController");
const authMiddleware = require("../middleware/auth");

const fundingRouter = express.Router();

fundingRouter.get("/", fundingsController.getAllFundings);
fundingRouter.post("/", fundingsController.createFunding);
module.exports = fundingRouter;
