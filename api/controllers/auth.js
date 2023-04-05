import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import  {OAuth2Client} from "google-auth-library"
import { imageUploader } from "../utils/cloudImage.js";



export const register = async (req, res, next) => {
  
  try {
    const user = await User.findOne({ email: req.body.email });
    if(user) return next(createError(401, "User already exist with this email"))
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const info = await imageUploader(req.files.file)
   if(info.error) return next(info.data)

    const newUser = new User({
      ...req.body,
      password: hash,
      img:info.data.secure_url,
      imgId: info.data.public_id
    });

    await newUser.save();
    res.status(201).json({message:"You are successfully register"});
  } catch (err) {
    next(err);
  }
};
const checkEmail = (username) => {
 if(
  username.includes("@gmail.com") || 
  username.includes("@hotmail.com") ||
  username.includes("@yahoomail.com")||
  username.includes("@")
 ) return true
 return false
}


export const login = async (req, res, next) => {
  const{username,  rememberMe} = req.body

  try {

    const user = checkEmail(username)? await User.findOne({ email:username }) : await User.findOne({username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT,
       {expiresIn: rememberMe? "30d" : "7d"}
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(new Date().setDate(new Date().getDate() + 30))
      })
      .status(200)
      .json({ data: { ...otherDetails, isAdmin }, message: "login success"});
  } catch (err) {
    next(err);
  }
};


const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT)

export const googleLoginController = async (req, res, next) => {

  const { tokenId } = req.body
  try{
    const resToken = await client.verifyIdToken({idToken: tokenId, audience: process.env.GOOGLE_AUTH_CLIENT})
    const cred = resToken.getPayload()
    const {  
    email,
    name,
    given_name,
    family_name,
    picture,
    email_verified
    } = cred
     if(email_verified){

       const dbUser = await User.findOne({email})
       if(dbUser) {
        const access_token = jwt.sign({id: dbUser._id}, process.env.JWT)
        const { password, isAdmin, ...otherDetails } = dbUser._doc;
        return res.cookie("access_token", access_token, {
          httpOnly: true,
          
        }).status(200).json({
          message: "login success",
          data: {...otherDetails, isAdmin}
        })
  
       }else{

         const newPassword = process.env.GOOGLE_AUTH_CLIENT + name
         const hashedPassword = bcrypt.hashSync(newPassword, 10)
         const newUser = new User({
          username: given_name,
          email,
          password:hashedPassword, 
          firstname:family_name, 
          lastname: given_name,
          city: "New York",
          country: "USA",
          img:picture,
          phone: "+1234567867"
    
        })
  
        const user = await newUser.save()
  
        const access_token = jwt.sign({id:user._id}, process.env.JWT)
        const { password, isAdmin, ...otherDetails } = user._doc;
      res
        .cookie("access_token", access_token, {
          httpOnly: true,
          expires: new Date(new Date().setDate(new Date().getDate() + 30))
        }).status(200).json({
          data: {...otherDetails, isAdmin},
          message: "login success"
        })
       }
  
     }else{
      return next(createError(403, "Google login failed. Please try another email address."))
     }
  
  }catch(error){
    console.log(error)
  }

}

export const logoutController = (req, res) => {
      res.clearCookie("access_token").status(200).json({message: "logout success"})
}