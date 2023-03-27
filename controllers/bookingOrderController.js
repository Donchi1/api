
import Booking from "../models/BookingOrder.js";
import User from "../models/User.js"
import Hotel from "../models/Hotel.js"

export const createBookings = async (req, res, next) => {
    const {
        bookings,
        amount,
        parsedRooms,
        totalBookedDates,   
    } = req.body

  const newBooking = new Booking({
    ...req.body,
      totalNights: totalBookedDates.length,
      bookedDates:totalBookedDates,
      bookedRoomsInfo:parsedRooms,
      totalPrice: amount,
      prices: bookings.map(each => each.price),
      totalBookedRooms: bookings.reduce((acc, init ) => acc + init.totalBookings,0)
  });
  try {
    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    next(err);
  }
};
export const updateBookings = async (req, res, next) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};


export const deleteBooking = async (req, res, next) => {
 
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Booking has been deleted."});
  } catch (err) {
    next(err);
  }
};


export const deleteAllBookings = async (req, res, next) => {
 
  try {
    await Booking.deleteMany({_id:{$ne: ""}});
    res.status(200).json({message:"All bookings has been deleted."});
  } catch (err) {
    next(err);
  }
};
export const getBooking = async (req, res, next) => {
  console.log(req.params)
  try {
    const booking = await Booking.findById(req.params.id);
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};
export const getUserBooking = async (req, res, next) => {
  const userId = req.params.id
  
  try {
    const booking = await Booking.find({userId});
    const mainbooking = await Promise.all(booking.map(async (each) => {
      const dbUser  = await User.findById(userId)
      const dbHotel  = await Hotel.findById(req.query.id? req.query.id : each.hotelId)

      return {user:dbUser, hotel:dbHotel, booking:each}
    }))
    res.status(200).json(mainbooking);
  } catch (err) {
    next(err);
  }
};
export const getAllBookings = async (req, res, next) => {

  const limit = req.query.limit

  try { 
      const bookings = await Booking.find().limit(limit? limit : 1000)
      const mainbooking = await Promise.all(bookings.map(async (each) => {
        const dbUser  = await User.findById(each.userId)
        const dbHotel  = await Hotel.findById(each.hotelId)
  
        return {user:dbUser, hotel:dbHotel, booking:each}
      }))

      return res.status(200).json(mainbooking);
  } catch (err) {
    next(err);
  }
};


export const getTotalRevenueTodayController = async (req, res, next) => {
    const date = new Date()
    const tomorrow = new Date(new Date().setDate(date.getDate() + 1))
    const yesterday = new Date(new Date().setDate(date.getDate() - 1))

    try{

      const info = await Booking.aggregate([
         {$match :{createdAt:{ $gt: yesterday, $lt: tomorrow}}},
         {$project:{ 
          price: "$totalPrice"}},
         {$group:{
          _id: "$_id",
          revenue: {$sum : "$price" }
         }}
        ])
       return res.status(200).json(info)
    }catch(error){
      next(error)
    }
}

export const getLastSixMonthController = async (req, res, next) => {
    const date = new Date()
    const lastSixMonths = new Date(new Date().setMonth(date.getMonth() - 6))
    

    try{

      const info = await Booking.aggregate([
         {$match :{createdAt:{ $gte: lastSixMonths, $lt: date}}},
         {$project:{ 
          price: "$totalPrice", month: {$month: "$createdAt"}}},
         {$group:{
          _id: "$month",
          total: {$sum : "$price" }
         }}
        ]).sort({_id: 1})
        res.status(200).json(info)
    }catch(error){
      next(error)
    }
}


