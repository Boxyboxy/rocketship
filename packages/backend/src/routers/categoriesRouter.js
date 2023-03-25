const express = require("express");

const categoriesController = require("../controllers/categoriesController");

const categoriesRouter = express.Router();

categoriesRouter.get("/", categoriesController.getAllCategories);

categoriesRouter.get("/:id", categoriesController.getCategoryById);

module.exports = categoriesRouter;
