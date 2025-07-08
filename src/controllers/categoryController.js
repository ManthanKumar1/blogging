let categoryModel = require('../models/categoryModel')
let userModel = require('../models/userModel')

let addCategory = async function (req, res) {
    try {
        let data = req.body
        let { title, desc, updatedBy } = data

        let { id } = req.token

        let checkId = await userModel.findOne({ _id: id })
        if (!checkId) {
            return res.status.send({ status: false, message: "User not found" })
        }

        data.updatedBy = id

        if (![1, 2].includes(checkId.role)) {
            return res.status(400).send({ status: false, message: "You are not able to add category" })
        }

        let checkCategory = await categoryModel.findOne({ title })
        if (checkCategory) {
            return res.status(400).send({ status: false, message: "Category is already exist" })
        }

        let addCategory = await categoryModel.create(data)
        return res.status(201).send({ status: true, message: "Category added successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateCategory = async function (req, res) {
    try {
        let { categoryId } = req.query
        let { id } = req.token

        let data = req.body
        let { title, desc } = data

        let checkCategory = await categoryModel.findOne({ _id: categoryId })
        if (!checkCategory) {
            return res.status(404).send({ status: false, message: "Category not found" })
        }

        let checkUser = await userModel.findOne({ _id: id })
        if (!checkUser) {
            return res.status(404).send({ status: false, message: "User not found" })
        }

        let checkTitle = await categoryModel.findOne({ title })
        if (checkTitle) {
            return res.status(400).send({ status: false, message: "Title already exist" })
        }

        checkCategory.title = title ? title : checkCategory.title
        checkCategory.desc = desc ? desc : checkCategory.desc
        checkCategory.updatedBy = id

        await checkCategory.save()
        return res.status(200).send({ status: true, message: "Category updated successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let deleteCategory = async function (req, res) {
    try {
        let { categoryId } = req.query
        let checkCategory = await categoryModel.findOne({ _id: categoryId })
        if (!checkCategory) {
            return res.status(404).send({ status: false, message: "Category not found" })
        }

        await categoryModel.findOneAndDelete({ _id: categoryId })
        return res.status(200).send({ status: true, message: "Category deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getAllCategory = async function (req, res) {
    try {
        let { search, size, page } = req.query
        let query = {}

        let sizeNumber = parseInt(size) || 10
        let pageNumber = parseInt(page) || 1

        if (search) {
            let reg = RegExp(search, "i")
            query = { $or: [{ title: reg }, {desc: reg}] }
        }

        let total = await categoryModel.countDocuments(query)
        let pages = Math.ceil(total/sizeNumber)

        let category = await categoryModel.find(query).skip((pageNumber - 1) * sizeNumber).limit(sizeNumber).sort({updatedBy: -1})
        return res.status(200).send({ status: true, message: "Category List", total: total, pages: pages, data: category })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let getCategory = async function (req, res){
    try {
        let {id} = req.query
        let fetchCategory = await categoryModel.findOne({_id: id})
        if(!fetchCategory){
            return res.status(404).send({status: false, message: "Category not found"})
        }

        return res.status(200).send({status: true, message: "Your category", data: fetchCategory})
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports = { addCategory, updateCategory, deleteCategory, getAllCategory, getCategory }