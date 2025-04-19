import express from "express";
import {
  getTurfs,
  postTurf,
  getPendingTurfs,
  getTurfById,
  approveTurf,
  rejectTurf,
  getTurfsByOwner,
  updateBookingStatus,
  postRating,
  getUserRating,
} from "../controllers/turf.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/postTurf").post(postTurf);
router.route("/getTurf").get(getTurfs);
router.route("/getPendingTurfs").get(getPendingTurfs);
router.route("/turf/:id").get(getTurfById);
router.route("/approveTurf/:id").patch(approveTurf);
router.route("/rejectTurf/:id").delete(rejectTurf);
router.route("/owner-turfs/:ownerId").get(getTurfsByOwner);
router.route("/update-booking-status/:bookingId").patch(updateBookingStatus);
router.route("/:turfId/rating").post(postRating);
router.route("/:turfId/user-rating/:userId").get(getUserRating);

export default router;
