import express from "express";
import {
  createBookings,
  deleteBooking,
  deleteAllBookings,
  getBooking,
  getAllBookings,
  updateBookings,
  getUserBooking,
  getTotalRevenueTodayController,
  getLastSixMonthController,
 
} from "../controllers/bookingOrderController.js";
import {verifyAdmin, verifyToken} from "../utils/verifyToken.js"
const router = express.Router();

//CREATE Bookings
router.post("/create",verifyToken, createBookings);

//UPDATE Bookings
router.put("/:id", verifyAdmin, updateBookings);

//DELETE Bookings
router.delete("/:id", verifyAdmin, deleteBooking);
router.delete("/", verifyAdmin, deleteAllBookings);

//GET Bookings
router.get("/find/:id", verifyToken, getBooking);
router.get("/single/:id", verifyToken, getUserBooking);
router.get("/revenue/today", verifyAdmin, getTotalRevenueTodayController);
router.get("/revenue/sixmonths", verifyAdmin, getLastSixMonthController);

//GET ALL BookingsS
router.get("/", verifyAdmin, getAllBookings);

export default router;
