let mongoose = require('mongoose')

let postSchema = mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String },
    // file: {type: mongoose.Types.ObjectId, ref: "File"},
    file: { type: String, default: "" },
    category: { type: mongoose.Types.ObjectId, ref: "Category", required: true },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "User" }
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema)