import { userModel } from "../models/usermodel.js"
import { signupValidation, loginValidation } from "../validator/userValidator.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utilities/generatetoken.js"

export const getHome = (req, res) => {
    res.send("Homepage!, server is active.")
    
}
export const getAbout = (req, res) => {
    res.send("Homepage!")
}

export const postUser = async (req, res) => {
try{
       const {username, email, password} = req.body

       const {error} = signupValidation.validate({
            username,
            email,
            password
})

        if(error) {
           res.status(400).json({
           message: error.details[0].message
})
}

const existingUser = await userModel.findOne({email})

        if(!existingUser) {
           res.status(400).json({
           message: `User with ${email} already exists, please login instead.`
})
}

const newUser = await userModel.create({
            username,
            email,
            password
        })

const token = await generateToken(newUser._id)
    res.cookie("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 *7
})
      


    res.status(201).json({
            data: newUser,
            message: "User created successfully!"
        })

    }catch(err) {
        console.error(err)
        throw new Error(err)
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        const {error} = loginValidation.validate({
            email,
            password
        })

        if(error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }

        const existingUser = await userModel.findOne({email})

        if(!existingUser) {
            return res.status(404).json({
                message: `User with ${email} not found. Signup instead.`
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid Credentials."
            })
        }

        const token = await generateToken(existingUser._id)

        res.cookie("auth-token", token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === "production",
           sameSite: "lax",
           maxAge: 1000 * 60 * 60 * 24 * 7
        })

        return res.status(200).json({
            data: existingUser,
            message: "User logged in successfully."
        })

    } catch (err) {
        console.error(err)
        throw new Error(err)
    }
}

export const getSingleUser = async (req, res) => {
    try{
        const { id } = req.params
        const user = await userModel.findById(id).select("-password")

        if(!user) {
            return res.status(404).json({
            message: `User wih ${id} does not exist.`
            })
        }

        return res.status(200).json({
            message: `User with ${id} retrieved`,
            data: user
        })

    }catch (err) {
        console.error(err)
        throw new Error (err)
    }
}
