import mongoose from "mongoose";

const turfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    images: {
      type: String,
    },
    price: {
      type: Number,
    },
    sports_type: {
      type: String,
    },
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 0,
          max: 5, // Assuming a 5-star rating system
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    linkes: {
      // Note: I assume this was meant to be "links"
      type: String,
    },
    state: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Calculate average rating before saving
turfSchema.pre("save", function (next) {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = Number((sum / this.ratings.length).toFixed(1));
  } else {
    this.averageRating = 0;
  }
  next();
});

export const Turf = mongoose.model("Turf", turfSchema);
