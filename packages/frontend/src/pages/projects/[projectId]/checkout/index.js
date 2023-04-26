import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../../../components/checkoutForm";
import { useRouter } from "next/router";
import Head from "next/head";
import config from "../../../../config/index";
import { useUser } from "@auth0/nextjs-auth0/client";
import axios from "axios";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function CustomCheckout() {
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState("");
  const [projectId, setProjectId] = useState();
  const [incentive, setIncentive] = useState();
  const [equity, setEquity] = useState();

  //for getting userId
  const { user, isLoading, error } = useUser();
  const [userId, setUserId] = useState();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/users?email=${user.email}`
        );
        setUserId(response.data[0].id);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId().then(console.log(userId));
  }, [user]);

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
    if (projectId && userId) {
      // Create PaymentIntent as soon as the page loads
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: [
            {
              projectId: projectId,
              incentive: incentive,
              equity: equity,
              userId: userId,
            },
          ],
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [projectId, userId]);

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
      <Head>
        <title>Payment for {incentive}</title>
      </Head>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm incentive={incentive} />
        </Elements>
      )}
    </div>
  );
}
