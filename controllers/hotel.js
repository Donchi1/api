import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import {  imageDelete, imageDeleteMultiple, imageUploaderMultiple } from "../utils/cloudImage.js";

export const createHotel = async (req, res, next) => {

  const info =  await imageUploaderMultiple(req.files)
   if(info.error) return next(info.data)
  const newHotel = new Hotel({...req.body, photos: info.data.map(each => each.secure_url)});
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    await imageDeleteMultiple(info.data)
    next(err);
  }
};
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

export const updateHotelTotalAndBooking = async(req, res, next) => {
   try{

   
  await Promise.all(req.body.bookings.map(async each => {
  const dbHotel =  await Hotel.findOne({rooms: {$in:[each.id]}})
  return  await dbHotel.updateOne({
          $set:{
              totalBookings: Number(dbHotel.totalBookings) + Number(each.totalBookings),
              totalBookPrice: Number(dbHotel.totalBookPrice) + Number(each.totalBookPrice)
          
          }
        })
      }))
      res.status(200).json("hotel updated")
   }catch(error){
      next(error)
   }   
   
}
export const deleteHotel = async (req, res, next) => {
  const deleteId = req.query.file
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    const info = await imageDelete(deleteId)
    if(info.error) return next(info.data)
    res.status(200).json({message:"Hotel has been deleted."});
  } catch (err) {
    next(err);
  }
};
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};
export const getHotels = async (req, res, next) => {
  const { min, max,fromAdmin, city, featured, limit} = req.query;
  
   
  try {
    if(fromAdmin){
      const hotels = await Hotel.find()
      return res.status(200).json(hotels);
    }
    if(featured){
      const hotels = await Hotel.find({
        featured: true
        
      }).limit(limit);
      return res.status(200).json(hotels);
      
    }

    const hotels = await Hotel.find({
      $or:[{cheapestPrice: { $gt: min , $lt: max  }}, {city}],
      
    });
    
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};
export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
 
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};
