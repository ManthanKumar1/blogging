let mongoose = require('mongoose')

let userSchema = mongoose.Schema({
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true, unique: true },
    userPassword: { type: String, required: true, minlength: 6 },
    role: { type: Number, default: 3 }, // role1: Super Admin, role2: Admin, role3: User
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false },
    forgotPasswordCode: {type: String},
    profilePic: {type: mongoose.Types.ObjectId, ref: "File"}
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)