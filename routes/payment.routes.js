import express from "express";
import dotenv from "dotenv";
import { handlePayment } from "../controllers/payment.controller.js";

dotenv.config();
const router = express.Router();
router.route("/post-payment").post(handlePayment);

export default router;
