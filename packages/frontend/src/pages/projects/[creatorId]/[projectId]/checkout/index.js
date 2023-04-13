import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "../../../../../components/checkoutForm";
import { useRouter } from "next/router";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function customCheckout() {
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState("");
  const [projectId, setProjectId] = useState();
  const [incentive, setIncentive] = useState();
  const [equity, setEquity] = useState();

  useEffect(() => {
    if (router.query.projectId) {
      setProjectId(router.query.projectId);
    }
    if (router.query.type) {
      setIncentive(router.query.type);
      if (router.query.type === "equity") {
        setEquity(10);
      }
    }
  }, [router.query.projectId, router.query.incentive]);

  useEffect(() => {
    if (projectId) {
      // Create PaymentIntent as soon as the page loads
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: [
            { projectId: projectId, incentive: incentive, equity: equity },
          ],
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [projectId]);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#21325e",
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
