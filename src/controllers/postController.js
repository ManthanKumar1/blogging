const categoryModel = require('../models/categoryModel')
const fileModel = require('../models/fileModel')
let postModel = require('../models/postModel')
const userModel = require('../models/userModel')

let addPost = async function (req, res) {
    try {
        let data = req.body
        let { title, desc, file, category, updatedBy } = data

        let { id } = req.token

        data.updatedBy = id

        if (file) {
            let checkFile = await fileModel.findOne({ _id: file })
            if (!checkFile) {
                return res.status(404).send({ status: false, message: "File not found" })
            }
        }

        let checkCategory = await categoryModel.findOne({ _id: category })
        if (!checkCategory) {
            return res.status(404).send({ status: false, message: "Category not found" })
        }

        let checkUser = await userModel.findOne({ _id: id })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        let addPost = await postModel.create(data)

        return res.status(201).send({ status: true, message: "Post added successfully", data: addPost })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updatePost = async function (req, res) {
    try {
        let { postId } = req.query
        let checkId = await postModel.findOne({ _id: postId })
        if (!checkId) {
            return res.status(404).send({ status: false, message: "Post not found" })
        }

        let { id } = req.token
        let checkUser = await userModel.findOne({ _id: id })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        let data = req.body
        let { title, desc, file, category, updatedBy } = data

        data.updatedBy = id

        if (file) {
            let checkFile = await fileModel.findOne({ _id: file })
            if (!checkFile) {
                return res.status(404).send({ status: false, message: "File not found" })
            }
        }

        if (category) {
            let checkCategory = await categoryModel.findOne({ _id: category })
            if (!checkCategory) {
                return res.status(404).send({ status: false, message: "Category not found" })
            }
        }

        checkId.title = title ? title : checkId.title
        checkId.desc = desc ? desc : checkId.desc
        checkId.file = file ? file : checkId.file
        checkId.category = category ? category : checkId.category
        checkId.updatedBy = id ? id : checkId.updatedBy
        await checkId.save()

        return res.status(200).send({ status: true, message: "Post updated successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deletePost = async function (req, res) {
    try {
        let { id } = req.query
        let checkId = await postModel.findOne({ _id: id })
        if (!checkId) {
            return res.status(404).send({ status: false, message: "Post not found" })
        }

        await postModel.findOneAndDelete({ _id: id })
        return res.status(200).send({ status: true, message: "Post deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let postList = async function (req, res) {
    try {
        let { page, size, q, category } = req.query

        let pageNumber = parseInt(page) || 1
        let sizeNumber = parseInt(size) || 10
        let query = {}

        if (q) {
            let search = new RegExp(q, "i")

            query = { $or: [{ title: search }] }
        }

        if(category){
            query = {...query, category}
        }

        let total = await postModel.countDocuments(query)
        let pages = Math.ceil(total / sizeNumber)

        let fetchPost = await postModel.find(query).sort({ updatedBy: -1 }).skip((pageNumber - 1) * sizeNumber).limit(sizeNumber)
        return res.status(200).send({ status: true, message: "All post", total: total, pages: pages, data: fetchPost })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getPost = async function (req, res) {
    try {
        let { id } = req.query
        let checkId = await postModel.findOne({ _id: id }).populate('file').populate('category').populate('updatedBy', '-userPassword')

        // let checkId = await postModel.findOne({ _id: id })
        if (!checkId) {
            return res.status(404).send({ status: false, message: "Post not found" })
        }

        return res.status(200).send({status: true, message: "Your Post", data: checkId})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { addPost, updatePost, deletePost, postList, getPost }