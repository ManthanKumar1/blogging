let mongoose = require('mongoose')
let {url} = require('../config/keys')
// let dotenv = require('dotenv')
// dotenv.config()

// let url = process.env.database

let database = async function () {
    try {
        await mongoose.connect(url)
        console.log("Database connected successfully")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = database 