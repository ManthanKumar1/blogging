let signupValidator = function ({ name, email, password, confirmPassword }) {
    let errors = {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    if (!name) {
        errors.name = 'Name is required'
    }

    if (!email) {
        errors.email = 'Email is required'
    }

    if (!password) {
        errors.password = 'Password is required'
    } else if(password.length < 6){
        errors.password = 'Password must be 6 character long'
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Confirm Password is required'
    } else if(password !== confirmPassword){
        errors.confirmPassword = 'Password does not match'
    }

    return errors
}

export default signupValidator