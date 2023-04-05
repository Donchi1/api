import * as url from "url"
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import paymentRoute from "./routes/payment.js";
import bookingRoute from "./routes/bookingOrder.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import { request } from "http";
export const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

const app = express();
dotenv.config();

const connect = async () => {
  const url = process.env.NODE_ENV === "development"? process.env.MONGO_DEV: process.env.MONGO_URL
  try {
    await mongoose.connect(url);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};
// mongoose connection
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});



//middlewares
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(fileUpload({useTempFiles: true, tempFileDir:`${__dirname}/uploads`, preserveExtension: true, safeFileNames: true}))
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/checkout", paymentRoute);
app.use("/api/bookings", bookingRoute);

//custom error handler


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
