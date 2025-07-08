let userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')

let fileModel = require('../models/fileModel')

let { secret } = require('../../config/keys')
let sendEmail = require('../validations/sendEmail')

const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

let signUp = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }

        let { userName, userEmail, userPassword, role } = data

        let checkEmail = await userModel.findOne({ userEmail })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: "Email already exist" })
        }

        const hashedPassword = await bcrypt.hash(userPassword, 10)
        data.userPassword = hashedPassword

        let signUp = await userModel.create(data)
        return res.status(201).send({ code: 201, status: true, message: "Signup successfully", data: signUp })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let signIn = async function (req, res) {
    try {
        let data = req.body

        let { userEmail, userPassword } = data

        let user = await userModel.findOne({ userEmail })
        if (!user) {
            return res.status(401).send({ status: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(userPassword, user.userPassword)
        if (!isMatch) {
            return res.status(401).send({ status: false, message: 'Incorrect password' })
        }

        user.userPassword = undefined;

        let token = jwt.sign({
            id: user._id
        }, secret,
            { expiresIn: "7d" }
        )

        res.status(200).send({ status: true, message: "SignIn successfully", data: { token, user } })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let verifyCode = async function (req, res) {
    try {
        let data = req.body
        let { userEmail } = data

        let checkUser = await userModel.findOne({ userEmail })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        if (checkUser.isVerified === true) {
            return res.status(400).send({ status: false, message: "User is already verified" })
        }

        let code = generateCode()

        let saveCode = await userModel.findOneAndUpdate({ userEmail }, { $set: { verificationCode: code } }, { new: true })

        await sendEmail({
            emailTo: userEmail,
            subject: "Email verification code",
            code: code,
            content: "verify your account"
        })

        return res.status(200).send({ status: true, message: "Code send successfully", data: saveCode })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let verifyUser = async function (req, res) {
    try {
        let data = req.body
        let { userEmail, verificationCode } = data

        let checkEmail = await userModel.findOne({ userEmail })
        if (!checkEmail) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        if (checkEmail.verificationCode != verificationCode) {
            return res.status(400).send({ status: false, message: "Verification code is invalid" })
        }

        checkEmail.isVerified = true
        checkEmail.verificationCode = null

        await checkEmail.save()
        return res.status(200).send({ status: true, message: "User verified successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let sendForgotPassword = async function (req, res) {
    try {
        let data = req.body
        let { userEmail } = data

        let checkUser = await userModel.findOne({ userEmail })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        let code = generateCode()

        checkUser.forgotPasswordCode = code

        await checkUser.save()

        await sendEmail({
            emailTo: userEmail,
            subject: "Forgot password code",
            code: code,
            content: "change your password"
        })

        return res.status(200).send({ status: true, message: "Forgot password code send successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let recoverPassword = async function (req, res) {
    try {
        let data = req.body
        let { userEmail, userPassword, forgotPasswordCode } = data

        let checkUser = await userModel.findOne({ userEmail })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        if (checkUser.forgotPasswordCode !== forgotPasswordCode) {
            return res.status(400).send({ status: false, message: "Code is invalid" })
        }

        let hashedPassword = await bcrypt.hash(userPassword, 10)
        checkUser.userPassword = hashedPassword
        checkUser.forgotPasswordCode = null

        await checkUser.save()

        return res.status(200).send({ status: true, message: "Password change successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let changePassword = async function (req, res) {
    try {
        let data = req.body
        let { oldPassword, newPassword } = data

        let { id } = req.token
        console.log(id)

        let user = await userModel.findOne({ _id: id })
        if (!user) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        let isMatch = await bcrypt.compare(oldPassword, user.userPassword)
        if (!isMatch) {
            return res.status(400).send({ status: false, message: "Password does not match" })
        }

        if (oldPassword === newPassword) {
            return res.status(400).send({ status: false, message: "Old and New Password is same" })
        }

        let hashedPassword = await bcrypt.hash(newPassword, 10)

        user.userPassword = hashedPassword

        await user.save()
        return res.status(200).send({ status: true, message: "Password change successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateProfile = async function (req, res) {
    try {
        let { id } = req.token
        console.log(id)
        let data = req.body
        let { userName, userEmail, profilePic } = data

        // let user = await userModel.findOne({_id: id}).select({userPassword: 0})
        let user = await userModel.findOne({ _id: id }).select('-userPassword -verificationCode -forgotPasswordCode')
        if (!user) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        if (profilePic) {
            let file = await fileModel.findOne({ _id: profilePic })

            if (!file) {
                return res.status(404).send({ status: false, message: " Profile Picture not found" })
            }
        }

        user.userName = userName ? userName : user.userName
        user.userEmail = userEmail ? userEmail : user.userEmail
        user.profilePic = profilePic ? profilePic : user.profilePic

        if (userEmail) {
            let checkEmail = await userModel.findOne({ userEmail })
            if (checkEmail && userEmail !== user.userEmail) {
                return res.status(400).send({ status: false, message: "Email already exist" })
            }
            user.isVerified = false
        }

        await user.save()

        return res.status(200).send({ status: true, message: "Profile updated successfully", data: user })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let currentUser = async function (req, res) {
    try {
        let {id} = req.token

        let user = await userModel.findOne({ _id: id }).select('-userPassword -verificationCode -forgotPasswordCode').populate('profilePic')
        if (!user) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        return res.status(200).send({ status: true, message: "Your details", data: user })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { signUp, signIn, verifyCode, verifyUser, sendForgotPassword, recoverPassword, changePassword, updateProfile, currentUser }