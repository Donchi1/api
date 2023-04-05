import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotelRooms,
  getHotels,
  updateHotel,
  updateHotelTotalAndBooking
} from "../controllers/hotel.js";
import {verifyAdmin, verifyToken} from "../utils/verifyToken.js"
const router = express.Router();

//CREATE HOTEL
router.post("/", verifyAdmin, createHotel);

//UPDATE HOTEL
router.put("/:id", verifyAdmin, updateHotel);
router.put("/bookings/update", verifyToken, updateHotelTotalAndBooking);
//DELETE HOTEL
router.delete("/:id", verifyAdmin, deleteHotel);
//GET HOTEL

router.get("/find/:id", getHotel);
//GET ALL HOTELS

router.get("/", getHotels);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);

export default router;
