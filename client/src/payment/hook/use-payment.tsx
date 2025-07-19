// src/hooks/usePayment.ts
import { useEffect } from "react";
import { useCreatePaymentIntentMutation } from "../../store/payment";

const usePayment = (amount: number) => {
  const [createPaymentIntent, { 
    data, 
    error, 
    isLoading 
  }] = useCreatePaymentIntentMutation();

  useEffect(() => {
    if (amount > 0) {
      createPaymentIntent({
        amount: Math.round(amount * 100),
        currency: "usd",
      }).catch(() => {}); // Prevent unhandled promise rejection
    }
  }, [amount, createPaymentIntent]);

  // Extract meaningful error message
  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    return (error as any)?.data?.error || "Payment initialization failed";
  };

  return {
    clientSecret: data?.clientSecret || null,
    error: getErrorMessage(),
    isLoading,
  };
};

export default usePayment;