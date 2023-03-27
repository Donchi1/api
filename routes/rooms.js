import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  getRoomStat,
  updateRoom,
  updateRoomAvailability,
} from "../controllers/room.js";
import Room from "../models/Room.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();
//CREATE
router.post("/:hotelid", verifyAdmin, createRoom);

//UPDATE
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", verifyAdmin, updateRoom);
//DELETE
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
//GET

router.get("/:id", getRoom);
//GET ALL

router.get("/", getRooms);
router.get("/stats/info", getRoomStat);

export default router;



// router.get("/stats/info", async(req, res, next) => {
//   console.log("am here")
//    try{
//   //  const info = await Room.aggregate([
//   //   {$match: {_id: {$exists: true}}},
//   //    {$project:{
//   //      info: {
//   //        $arrayToObject: {
//   //         $map:{
//   //           input: "$roomNumbers",
//   //           as:"el",
//   //           in:{
//   //             "k":"id",
//   //             "v":"$$el.unavailableDates"
//   //           }
            
//   //         }
//   //       },
//   //     },
//   //     priceData: "$price",
//   //    }
//   //   },

//   //    {$group: {
//   //     _id: "$priceData",
//   //     prices: {$sum: "$priceData"},
//   //     total:  {$push:"$info"}
//   //    }}

//   //  ])
//    const ht = await Room.find()
//    //console.log(ht[0].roomNumbers.map((r, i) => r.unavailableDates.length))
//    console.log(ht.map(each => each.roomNumbers.map(r => r.unavailableDates.length)))
//    //res.status(200).json(info)
//   }catch(err){
//     console.log(err)
//   }
// });