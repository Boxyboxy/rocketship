const express = require("express");

const bankAccountsController = require("../controllers/bankAccountsController");
const authMiddleware = require("../middleware/auth");
const isAdmin = require("../middleware/adminAuth");
const bankAccountsRouter = express.Router();

bankAccountsRouter.get("/", bankAccountsController.getAllBankAccounts);

bankAccountsRouter.get("/:id", bankAccountsController.getBankAccountById);

module.exports = bankAccountsRouter;
