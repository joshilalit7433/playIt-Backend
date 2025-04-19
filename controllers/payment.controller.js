import { Payment } from "../models/payment.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const handlePayment = async (req, res) => {
  try {
    const { amount, currency, userId } = req.body;

    // Validate required fields
    if (!amount || !currency || !userId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { userId },
    });

    // Save the payment intent details to the database
    const payment = new Payment({
      amount,
      currency,
      userId,
      paymentId: paymentIntent.id, // Use Stripe's PaymentIntent ID
    });

    await payment.save();

    // Respond with the client secret and success message
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: "Payment created and saved successfully.",
    });
  } catch (error) {
    console.error("Error handling payment:", error.message);
    res.status(500).json({ error: "Failed to handle payment." });
  }
};
