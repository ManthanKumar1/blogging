let { validationResult, check } = require('express-validator')
let validateEmail = require('./validateEmail')

let validate = function (req, res, next) {
    let errors = validationResult(req)
    let mappedError = {}
    if (errors.isEmpty()) {
        return next()
    } else {
        errors.errors.map((err) => {
            mappedError[err.path] = err.msg
        })
        res.status(400).send(mappedError)
    }
}

let signUpValidator = [
    check("userName").notEmpty().withMessage("Name is required"),
    check("userEmail").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Email"),
    check("userPassword").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password should 6 character long")
]

let signInValidator = [
    check('userEmail').notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Email"),
    check("userPassword").notEmpty().withMessage("Password is required")
]

let emailValidator = [
    check('userEmail').notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Email")
]

let verifyUserValidator = [
    check('userEmail').notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Email"),
    check('verificationCode').notEmpty().withMessage("Verification Code is required")
]

let recoverPasswordValidator = [
    check('userEmail').notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Email"),
    check("userPassword").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password should 6 character long"),
    check('forgotPasswordCode').notEmpty().withMessage("Verification Code is required")
]

let changePasswordValidator = [
    check("oldPassword").notEmpty().withMessage("Password is required"),
    check("newPassword").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password should 6 character long"),
]

let updateProfileValidator = [
    // check("userName").notEmpty().withMessage("Name is required"),
    check("userEmail").custom(async (userEmail) => {
        if(userEmail){
            let isValidEmail = validateEmail(userEmail)
            if(!isValidEmail){
                throw "Invalid email"
            }
        }
    }),
]

module.exports = { validate, signUpValidator, signInValidator, emailValidator, verifyUserValidator, recoverPasswordValidator, changePasswordValidator, updateProfileValidator }