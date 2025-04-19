import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createBooking,
  displayUserBookings,
  displayTurfBookings,
  rateBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.route("/create-booking").post(createBooking);
router.route("/get-user-bookings/:userId").get(displayUserBookings);
router.route("/get-turf-bookings/:turfId").get(displayTurfBookings);
router.route("/rate-booking/:bookingId").post(isAuthenticated, rateBooking);
export default router;
