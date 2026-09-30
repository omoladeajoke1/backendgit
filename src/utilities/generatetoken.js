
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const generateToken = async (userId) => {
    const token = await jwt.sign({ id:userId }, process.env.JWT_TOKEN, {
        expiresIn: "7d"
    })
    return token
}