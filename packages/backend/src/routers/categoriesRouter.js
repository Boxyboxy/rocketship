const express = require("express");

const categoriesController = require("../controllers/categoriesController");
const authMiddleware = require("../middleware/auth");
const isAdmin = require("../middleware/adminAuth");
const categoriesRouter = express.Router();

categoriesRouter.get("/", categoriesController.getAllCategories);

categoriesRouter.get("/:id", categoriesController.getCategoryById);

module.exports = categoriesRouter;
