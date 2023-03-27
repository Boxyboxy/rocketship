const express = require("express");

const usersController = require("../controllers/usersController");

const usersRouter = express.Router();

usersRouter.get("/", usersController.getAllUsers);
usersRouter.get("/:id", usersController.getUserById);
usersRouter.patch("/:id", usersController.updateUserById);
usersRouter.post("", usersController.createUser);
usersRouter.delete("/:id", usersController.deleteUser);
module.exports = usersRouter;
