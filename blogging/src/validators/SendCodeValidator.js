let sendCodeValidator = function ({ email }) {
    let errors = {
        email: "",
    }

    if (!email) {
        errors.email = 'Email is required'
    }

    return errors
}

export default sendCodeValidator