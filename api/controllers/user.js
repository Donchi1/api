import User from "../models/User.js";
import { imageDelete } from "../utils/cloudImage.js";

export const updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
export const deleteUser = async (req,res,next)=>{
  const deleteId = req.query.file
 

  try {
    await User.findByIdAndDelete(req.params.id);
    const info = await imageDelete(deleteId)
    if(info.error) return next(info.data)
    res.status(200).json({message:"User has been deleted."});
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req,res,next)=>{

  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({user});
  } catch (err) {
    next(err);
  }
}
export const getUsers = async (req,res,next)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}