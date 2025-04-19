import { Turf } from "../models/turf.model.js";
import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js"; // Assuming you have a Booking model

export const postTurf = async (req, res) => {
  try {
    const {
      name,
      location,
      description,
      images,
      price,
      sports_type,
      ratings,
      linkes,
      address,
      state,
      owner,
    } = req.body;

    if (
      !name ||
      !location ||
      !description ||
      !images ||
      !price ||
      !sports_type ||
      !linkes ||
      !address
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }
    const turf = await Turf.create({
      name,
      location,
      description,
      images,
      price,
      sports_type,
      ratings,
      linkes,
      address,
      state,
      owner,
    });

    if (owner) {
      await User.findByIdAndUpdate(owner, {
        $push: { ownedTurfs: turf._id },
      });
    }

    return res.status(201).json({
      message: "New turf created successfully.",
      turf,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error creating turf",
      success: false,
    });
  }
};

export const getTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find();

    if (!turfs || turfs.length === 0) {
      return res.status(404).json({
        message: "No turfs found.",
        success: false,
      });
    }

    return res.status(200).json({
      turfs,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching turfs:", error.message, error.stack);
    return res.status(500).json({
      message: "An error occurred while fetching turfs.",
      success: false,
    });
  }
};

export const getPendingTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find({ state: false });

    if (!turfs || turfs.length === 0) {
      return res.status(404).json({
        message: "No pending turf requests found.",
        success: false,
      });
    }

    return res.status(200).json({
      turfs,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching pending turfs:", error.message, error.stack);
    return res.status(500).json({
      message: "An error occurred while fetching pending turfs.",
      success: false,
    });
  }
};

export const getTurfById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Turf ID is required",
      });
    }

    const turf = await Turf.findById(id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    return res.status(200).json({
      success: true,
      turf,
    });
  } catch (error) {
    console.error("Error fetching turf:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch turf details",
    });
  }
};

export const approveTurf = async (req, res) => {
  try {
    const turf = await Turf.findByIdAndUpdate(
      req.params.id,
      { state: true },
      { new: true }
    );
    return res.status(200).json({
      message: "Turf approved successfully",
      turf,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error approving turf",
      success: false,
    });
  }
};

export const rejectTurf = async (req, res) => {
  try {
    await Turf.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Turf rejected and deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error rejecting turf",
      success: false,
    });
  }
};

export const getTurfsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({
        message: "Owner ID is required",
        success: false,
      });
    }

    const turfs = await Turf.find({ owner: ownerId });

    return res.status(200).json({
      success: true,
      turfs,
    });
  } catch (error) {
    console.error("Error fetching owner's turfs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch owner's turfs",
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and status are required",
      });
    }

    const validStatuses = ["confirmed", "cancelled", "pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};

export const postRating = async (req, res) => {
  try {
    const { turfId } = req.params;
    const { rating, comment, userId } = req.body; // Require userId in the request body

    // Validation
    if (!turfId) {
      return res.status(400).json({
        success: false,
        message: "Turf ID is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!rating || typeof rating !== "number" || rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 0 and 5",
      });
    }

    // Find the turf
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    // Check if user already rated
    const existingRatingIndex = turf.ratings.findIndex(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingRatingIndex !== -1) {
      // User has already rated, update the existing rating
      turf.ratings[existingRatingIndex].rating = rating;
      turf.ratings[existingRatingIndex].comment =
        comment || turf.ratings[existingRatingIndex].comment; // Update comment if provided, else keep old one
      turf.ratings[existingRatingIndex].createdAt = Date.now(); // Optionally update timestamp
    } else {
      // User hasn't rated yet, add new rating
      turf.ratings.push({
        user: userId,
        rating,
        comment,
      });
    }

    // Save and update average rating (pre-save hook will handle this)
    await turf.save();

    return res.status(200).json({
      success: true,
      message:
        existingRatingIndex !== -1
          ? "Rating updated successfully"
          : "Rating added successfully",
      turf: {
        _id: turf._id,
        name: turf.name,
        ratings: turf.ratings,
        averageRating: turf.averageRating,
      },
    });
  } catch (error) {
    console.error("Error posting rating:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add or update rating",
    });
  }
};

export const getUserRating = async (req, res) => {
  try {
    const { turfId, userId } = req.params;

    // Validate parameters
    if (!turfId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Both turf ID and user ID are required",
      });
    }

    // Find the turf
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: "Turf not found",
      });
    }

    // Find the user's rating
    const userRating = turf.ratings.find(
      (rating) => rating.user.toString() === userId.toString()
    );

    if (!userRating) {
      return res.status(200).json({
        success: true,
        message: "User has not rated this turf",
        rating: 0, // Return 0 if no rating found
      });
    }

    return res.status(200).json({
      success: true,
      rating: userRating.rating,
      comment: userRating.comment,
      createdAt: userRating.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user rating",
    });
  }
};
