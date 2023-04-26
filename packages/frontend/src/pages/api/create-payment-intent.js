// This is your test secret API key.
const stripe = require("stripe")(process.env.NEXT_STRIPE_SECRET_KEY);

const calculatePurchaseAmount = (product) => {
  // Calculate the order total on the server to prevent people from directly manipulating the amount on the client
  if (product[0].incentive === "membership") {
    return 2000;
  } else {
    return 14000;
  }
};

export default async function stripeIntentHandler(req, res) {
  const { product } = req.body;

  // Create a PaymentIntent with the order amount and other fields within metadata
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculatePurchaseAmount(product),
    currency: "sgd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      projectId: product[0].projectId,
      // need to update this to gather own user Id - person who's making the purchase
      userId: product[0].userId,
      incentive: product[0].incentive,
      equity: product[0].equity,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}
