let fileModel = require('../models/fileModel')
let { upload, signedUrl, fileDelete } = require('./aws')

let path = require('path')
let extension = ['jpg', 'jpeg', 'png', 'pdf']

let uploadFile = async function (req, res) {
    try {
        let data = req.file
        if (!data) {
            return res.status(400).send({ status: false, message: "Provide a file" })
        }

        let ext = path.extname(data.originalname)
        let lowExt = ext.toLowerCase().slice(1)
        if (!extension.includes(lowExt)) {
            return res.status(400).send({ status: false, message: "Only jpg, jpeg, png, and pdf files are allowed" })
        }

        let key = await upload({ file: data, ext })
        if(key){
            await fileModel.create({key: key, size: data.size, mimeType: data.mimeType, createdBy: req.token})
        }
        return res.status(201).send({ status: true, message: "File uploaded successfully", data: key })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let fetchFile = async function (req, res){
    try {
        let {key} = req.query
        let url = await signedUrl(key)

        return res.status(200).send({status: true, message: "Your picture url", data: url})
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

let deleteFile = async function (req, res){
    try {
        let {key} = req.query
        await fileDelete(key)

        await fileModel.findOneAndDelete({key})

        return res.status(200).send({status: true, message: "Your picture deleted successfully"})
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports = { uploadFile, fetchFile, deleteFile }