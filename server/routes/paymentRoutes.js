import express from "express";
import Stripe from "stripe";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent (for Stripe Elements)
router.post("/create-payment-intent", authenticateToken, async (req, res) => {
  try {
    const { amount, currency = "eur" } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // in cents
      currency,
      metadata: {
        userId: req.user.id,
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Payment Intent error:", err);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
});

export default router;
