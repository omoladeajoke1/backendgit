
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 16
  },
  email: {
    type: String,
    required: true, 
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 16
  }  
}, {timestamps: true})

 userSchema.pre("save", async function(next) {
if(!this.isModified("password")) return next()

const salt = await bcrypt.genSalt(10)

const hashedPassword = await bcrypt.hash(this.password, salt)

this.password = hashedPassword
})

export const userModel = mongoose.model("User", userSchema)