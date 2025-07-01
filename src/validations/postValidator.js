let { check } = require('express-validator')
let mongoose = require('mongoose')

let addPostValidator = [
    check('title').notEmpty().withMessage("Title is required"),
    check('file').custom(async (file) => {
        if (file && !mongoose.Types.ObjectId.isValid(file)) {
            throw "Invalid file id"
        }
    }),
    check('category').notEmpty().withMessage("Category is required").custom(async (category) => {
        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            throw "Invalid category id"
        }
    }),
]

let updatePostValidator = [
    check('file').custom(async (file) => {
        if (file && !mongoose.Types.ObjectId.isValid(file)) {
            throw "Invalid file id"
        }
    }),
    check('category').custom(async (category) => {
        if (category && !mongoose.Types.ObjectId.isValid(category)) {
            throw "Invalid category id"
        }
    }),
]

module.exports = { addPostValidator, updatePostValidator }