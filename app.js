import { configDotenv } from "dotenv";
configDotenv();
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import examRoutes from "./routes/exam.routes.js";
import adExamRoutes from "./routes/adminExam.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import paymentsRoutes from "./routes/payment.rotes.js";
// import paymentRoutes from "./routes/payment.routes.js";
import miscellaneousRoutes from "./routes/miscellaneous.routes.js";
import express from "express";
import connectToDb from "./config/db.config.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
// app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }));

const corsOptions = {
  origin: process.env.CLIENT_URL || "*", // Default to '*' if CORS_ORIGIN is not set
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/exam", examRoutes);
app.use("/api/v1/courses", adExamRoutes);
app.use("/api/v1/category", categoryRoutes);
// app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/", miscellaneousRoutes);
app.use("/api/v1", paymentsRoutes);

app.all("*", (req, res) => {
  res.status(404).send("OOPS!! 404 page not found");
});

app.use(errorMiddleware);

// db init
connectToDb();

export default app;
