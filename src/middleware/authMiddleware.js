
import jwt from "jsonwebtoken";
import { userModel } from "../models/usermodel.js";
import dotenv from "dotenv";
dotenv.config()

export const authCheck = async (req, res, next) => {
     try{
        const token = req.cookies["auth.token"]

        if(!token) {
            return res.status(404).json({
                message: "No token found or token compromised, signup or login"
            })
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_TOKEN)
        const user = await userModel.findById (decodedToken.id)

        if(!user) {
            return res.status(401).json({
                message: `Not authenticated, please signup or login to access`
            })
        }

        req.user = user

        next()

     } catch (err) { 
        if(err instanceof Error) {
        console.error(err)
        throw new Error(err)
        }
       
     }
}