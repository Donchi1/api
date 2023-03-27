import stripe from "stripe" 

import {createError} from "../utils/error.js"

export const stripePayment = async (req, res, next) => {
    const myStripe = new stripe(process.env.STRIPE_KEY_TEST)

    try{
const paymentIntent = await myStripe.paymentIntents.create({
        amount:req.query.amount,
        currency: "usd"
    })
    return res.status(200).json({clientSecret: paymentIntent.client_secret})
    }catch(error){
   
        return next(createError(500, error.raw.message))
    }
    
}