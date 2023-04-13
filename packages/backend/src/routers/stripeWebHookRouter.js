const express = require("express");

const stripeController = require("../controllers/stripe/webhookHandler");
const authMiddleware = require("../middleware/auth");

const stripeWebHookRouter = express.Router();

// Handle Stripe webhook events
stripeWebHookRouter.post("/", stripeController.handleSuccessfulPaymentIntent);

module.exports = stripeWebHookRouter;
