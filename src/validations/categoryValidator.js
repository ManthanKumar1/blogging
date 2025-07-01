let { validationResult, check } = require('express-validator')

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

let addCategoryValidator = [check("title").notEmpty().withMessage("Title is required")]

module.exports = {validate, addCategoryValidator}