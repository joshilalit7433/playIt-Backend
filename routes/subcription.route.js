import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createSubscription,
  getAllSubscriptions,
} from "../controllers/subcription.controller.js";

const router = express.Router();

router.route("/create").post(createSubscription);
router.route("/get-all-subscription").get(getAllSubscriptions);

export default router;
