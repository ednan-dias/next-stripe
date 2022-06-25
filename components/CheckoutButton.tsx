import React from "react";

import stripeConfig from "../config/stripe";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(stripeConfig.publicKey);

interface CheckoutButtonProps {
  priceId: string;
  itemName: string;
}

function CheckoutButton({ priceId, itemName }: CheckoutButtonProps) {
  const handleClick = async () => {
    const stripe = await stripePromise;

    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      successUrl: `http://localhost:3000/success?itemName=${itemName}`,
      cancelUrl: "http://localhost:3000/cancel",
    });

    if (error) {
      console.log(error);
    }
  };

  return (
    <button role="link" onClick={handleClick}>
      Comprar
    </button>
  );
}

export default CheckoutButton;
