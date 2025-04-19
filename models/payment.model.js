import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  // Stripe Payment Intent ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Reference to User
  amount: { type: Number, required: true },
  // Amount in smallest currency unit (e.g., paise for INR)
  currency: { type: String, default: "inr" },
  // Currency used for payment
  status: { type: String, required: false },
  // Payment status (e.g., succeeded, failed)
  createdAt: { type: Date, default: Date.now },
  // Payment creation timestamp
  metadata: { type: Object, default: {} },
  // Additional metadata from Stripe
});

export const Payment = mongoose.model("Payment", paymentSchema);
