const { createFunding } = require("../../repositories/fundingRepository");
const stripe = require("stripe")(process.env.NEXT_STRIPE_SECRET_KEY);

module.exports = {
  // Handle a successful payment intent event
  async handleSuccessfulPaymentIntent(req, res) {
    try {
      // Verify the event is from Stripe
      const signature = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(err);
        console.log(`event construction failed`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      if (event.data.object.object === "payment_intent") {
        // Get the payment intent ID from the event
        const paymentIntentId = event.data.object.id;
        // console.log(paymentIntentId);

        // Get the payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );

        console.log("paymentIntent status" + paymentIntent.status);

        // Check if the payment was successful
        if (paymentIntent.status === "succeeded") {
          // Get the relevant fields: amount, projectId, userId, incentive, equity
          const amount = paymentIntent.amount;
          const projectId = paymentIntent.metadata.projectId;
          const userId = paymentIntent.metadata.userId;
          const incentive = paymentIntent.metadata.incentive;
          const equity = paymentIntent.metadata.equity;

          // Create a new funding record in the database
          const funding = await createFunding({
            amount: amount,
            projectId: projectId,
            userId: userId,
            incentive: incentive,
            equity: equity,
          });

          // Return a success response to Stripe
          res.json({ received: true });
        } else {
          console.log("Payment intent status is not successful.");
        }
      }
    } catch (err) {
      console.log(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },
};
