import { Subscription } from "../models/subscription.model.js";
import { Booking } from "../models/booking.model.js";

export const createSubscription = async (req, res) => {
  try {
    const {
      userId,
      turfId,
      startDate,
      endDate,
      price,
      paymentDetails,
      selectedSlots,
    } = req.body;

    if (
      !userId ||
      !turfId ||
      !startDate ||
      !endDate ||
      !price ||
      !paymentDetails
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Calculate duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newSubscription = new Subscription({
      userId,
      turfId,
      startDate,
      endDate,
      price,
      duration,
      paymentDetails,
      isActive: true,
    });

    await newSubscription.save();

    // Create individual bookings for each slot
    const bookingPromises = selectedSlots.map((slot) => {
      return new Booking({
        turfId,
        userId,
        paymentId: paymentDetails.transactionId,
        bookingDate: new Date(slot.date),
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: "confirmed",
        amountPaid: price / selectedSlots.length,
        paymentStatus: "paid",
        subscriptionId: newSubscription._id,
      }).save();
    });

    await Promise.all(bookingPromises);

    res.status(201).json({
      message: "Subscription and bookings created successfully",
      subscription: newSubscription,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating subscription",
      error: err.message,
    });
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate("userId turfId");
    res.status(200).json({ subscriptions });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching subscriptions", error: err.message });
  }
};
