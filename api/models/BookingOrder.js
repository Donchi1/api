import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
  hotelId: {
    type: String,
    required: true,
  },
  totalNights: {
    type: Number,
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },
  prices: {
    type: [Number],
    required: true,
  },
  payment_method: String,
  currency: String,
  userId: {
    type: String,
    required: true,
  },
  bookedRoomsInfo: Array,
  bookedDates:[String],
  totalBookedRooms: {
    type: Number,
  },
 
}, {timestamps: true});

export default mongoose.model("Bookings", BookingSchema);
