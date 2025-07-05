let express = require('express')
let app = express()
let cors = require('cors')
let dotenv = require('dotenv')

dotenv.config()

let database = require('../connection/database')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

database()

module.exports = app