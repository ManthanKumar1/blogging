let express = require('express')
let app = express()
let dotenv = require('dotenv')

dotenv.config()

let database = require('../connection/database')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

database()

module.exports = app