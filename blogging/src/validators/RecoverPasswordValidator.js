let recoverPasswordValidator = function ({ code, password }) {
    let errors = {
        code: "",
        password: ""
    }

    if (!code) {
        errors.code = 'Code is required'
    }

    if (!password) {
        errors.password = 'Password is required'
    } else if(password.length < 6){
        errors.password = 'Password must be 6 character long'
    }

    return errors
}

export default recoverPasswordValidator