let passwordValidator = function ({ oldPassword, newPassword }) {
    let errors = {
        oldPassword: "",
        newPassword: ""
    }

    if (!oldPassword) {
        errors.oldPassword = 'Old Password is required'
    }

    if (!newPassword) {
        errors.newPassword = 'New Password is required'
    } else if(newPassword.length < 6){
        errors.newPassword = 'Password must be 6 character long'
    }

    if(oldPassword && oldPassword === newPassword){
        errors.newPassword = "You are providing old password"
    }

    return errors
}

export default passwordValidator