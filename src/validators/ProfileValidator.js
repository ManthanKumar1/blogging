let profileValidator = function ({ name, email, password, confirmPassword }) {
    let errors = {
        name: "",
        email: "",
    }

    if (!name) {
        errors.name = 'Name is required'
    }

    if (!email) {
        errors.email = 'Email is required'
    }

    return errors
}

export default profileValidator