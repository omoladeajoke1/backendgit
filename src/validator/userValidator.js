
import Joi from "joi";

export const signupValidation = Joi.object({
    username: Joi.string().required().min(3).max(16),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(16)
})

export const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(16)
})