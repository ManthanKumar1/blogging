let http = require('http')
let morgan = require('morgan')
let app = require('./app')
let route = require('./routes/route')
let errorHandler = require('./middlewares/errorHandler')

// let dotenv = require('dotenv')

// dotenv.config()

app.use(morgan('dev'))

app.use('/', route)

app.use(function (req, res) {
    return res.status(400).send({ status: false, msg: 'Invalid Url' })
})

app.use(errorHandler);

let { port } = require('../config/keys')

let server = http.createServer(app)

server.listen(port, function () {
    console.log(`Server is running on port ${port}`)
})

// let port = process.env.port || 3000

// app.listen(port, function (){
//     console.log(`Server is running on port ${port}`)
// })