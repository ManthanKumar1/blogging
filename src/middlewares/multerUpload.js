let multer = require('multer')
let path = require('path')

let extension = ['jpg', 'jpeg', 'png', 'pdf']

let storage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, path.join(__dirname, '../../uploads'))
    },
    filename: function (req, file, callback){
        let name = file.originalname
        let ext = path.extname(name)
        let lowExt = ext.toLowerCase().slice(1)
        if(!extension.includes(lowExt)){
            return callback(new Error("Only jpg, jpeg, png, and pdf files are allowed"))
        }
        let filename = name.replace(ext, "")
        let compressFileName = filename.split(" ").join("_")
        
        let lowercaseFilename = compressFileName.toLowerCase()

        let finalFile = `${lowercaseFilename}_${Date.now()}${ext}`

        callback(null, finalFile)
    }
})

let upload = multer({
    // dest: path.join(__dirname, '../../uploads')
    storage,
    // fileFilter: (req, file, callback) => {
    //     console.log(file)
    //     callback(null, true)
    // }
})

module.exports = { upload }