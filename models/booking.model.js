import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    turfId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turf",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentId: {
      type: String,
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    // paymentDetails: {
    //   transactionId: String,
    //   method: {
    //     type: String,
    //     enum: ["credit_card", "debit_card", "upi", "net_banking"],
    //   },
    // },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
