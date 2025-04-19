import { Booking } from "../models/booking.model.js";
import { Turf } from "../models/turf.model.js";
import { User } from "../models/user.model.js";

export const createBooking = async (req, res) => {
  try {
    const {
      turfId,
      userId,
      paymentId,
      bookingDate,
      startTime,
      endTime,
      status,
      amountPaid,
      paymentStatus,
    } = req.body;

    // Check if any required field is missing
    if (
      !turfId ||
      !userId ||
      !paymentId ||
      !bookingDate ||
      !startTime ||
      !endTime ||
      !status ||
      !amountPaid ||
      !paymentStatus
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        required: {
          turfId,
          userId,
          paymentId,
          bookingDate,
          startTime,
          endTime,
          status,
          amountPaid,
          paymentStatus,
        },
      });
    }

    // Validation: Check if Turf exists
    const turfExists = await Turf.findById(turfId);
    if (!turfExists) {
      return res.status(404).json({ message: "Turf not found." });
    }

    // Validation: Check if User exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      turfId,
      bookingDate,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (conflictingBooking) {
      return res
        .status(409)
        .json({ message: "Time slot already booked for this turf." });
    }

    // Create and save the booking
    const booking = await Booking.create(req.body);

    return res.status(201).json({
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const displayUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch bookings for the user, including turf details
    const bookings = await Booking.find({ userId })
      .populate({
        path: "turfId", // Populate turf details
        select: "name location price images", // Include only necessary fields
      })
      .sort({ bookingDate: -1 }); // Sort by booking date, most recent first

    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user." });
    }

    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

export const displayTurfBookings = async (req, res) => {
  try {
    const { turfId } = req.params;

    const bookings = await Booking.find({ turfId })
      .populate({
        path: "userId",
        select: "fullname email mobilenumber",
      })
      .sort({ bookingDate: -1 });

    return res.status(200).json({
      success: true,
      message:
        bookings.length > 0
          ? "Turf bookings retrieved successfully"
          : "No bookings found for this turf.",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching turf bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch turf bookings.",
      error: error.message,
    });
  }
};

// ... existing controller functions ...

// @desc    Rate a booking
// @route   POST /api/v1/booking/rate/:bookingId
// @access  Private
export const rateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating } = req.body;

    // Validate rating
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the booking belongs to the user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to rate this booking",
      });
    }

    // Update the booking with the rating
    booking.rating = rating;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error in rateBooking:", error);
    res.status(500).json({
      success: false,
      message: "Error updating rating",
      error: error.message,
    });
  }
};
