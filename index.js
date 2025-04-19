import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import turfRoute from "./routes/turf.route.js";
import subcriptionRoute from "./routes/subcription.route.js";
import bookingRoute from "./routes/booking.route.js";
import paymentRoute from "./routes/payment.routes.js";
import subscriptionRoute from "./routes/subscription.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};
app.use(cors(corsOptions));

// Set port
const PORT = process.env.PORT || 8000;

// Connect to database
connectdb();

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/turf", turfRoute);
app.use("/api/v1/subcription", subcriptionRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/subscription", subscriptionRoute);

// Start server and store instance
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown to avoid EADDRINUSE on restart
const cleanup = () => {
    console.log("Shutting down server...");
    server.close(() => {
        console.log("Server closed gracefully.");
        process.exit(0);
    });
};

// Handle process termination signals
process.on("SIGTERM", cleanup);  // Nodemon restart triggers this
process.on("SIGINT", cleanup);   // Ctrl+C triggers this
