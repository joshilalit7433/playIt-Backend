import express from "express";
import { createSubscription } from "../controllers/subcription.controller.js";

const router = express.Router();
router.route("/create").post(createSubscription);

export default router;
