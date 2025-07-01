let mongoose = require('mongoose')

let fileSchema = mongoose.Schema({
    key: {type: String, required: true},
    size: {type: Number},
    mimeType: {type: String},
    createdBy: {type: mongoose.Types.ObjectId, ref: "User"}
}, {timestamps: true})

module.exports = mongoose.model('File', fileSchema)