import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./srtipre-payment-form";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm  />
    </Elements>
  );
};

export default PaymentPage;
