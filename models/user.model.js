import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobilenumber: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      required: true,
    },

    // Change from single reference to array of references
    ownedTurfs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turf", // Reference to the Turf model
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
