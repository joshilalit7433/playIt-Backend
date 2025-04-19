import mongoose from "mongoose";
const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    turfId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turf",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    selectedSlots: [
      {
        date: Date,
        startTime: String,
        endTime: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    paymentDetails: {
      method: {
        type: String,
        enum: ["credit_card", "debit_card", "upi", "net_banking", "cash"],
      },
      transactionId: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);
