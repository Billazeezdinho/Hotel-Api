// import Joi
const Joi = require('joi')

exports.registerValidate = async (req, res, next) =>{
    const schema = Joi.object({
        fullName: Joi.string()
        .min(3)
        .trim()
        .pattern(/^[A-Za-z ]+$/)
        .required()
        .messages({
            "any.required": ' FullName is required',
            "string.empty": 'full Name cannot be empty',
            "string.pattern.base": "FullName should only contain alphabets",
            "string.min": "fullname should not be less than 3 letters"
        }),
        email: Joi.string.email()
        .required()
        .messages({
            "any.required":"Email is required",
            "string.email":"Invalid Email Format"
        }),
        password: Joi.string()
        .min(6)
        .required()
        .messages({
            "any.required": "Password is required",
            "string.min": " password must be at least 6 characters"
        })

    })
    const result = schema.validate(req.body, {abortEarly: false})
    console.log(result)
    next();
    
} ;