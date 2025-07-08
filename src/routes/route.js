let express = require('express')
let router = express.Router()

let { signUp, signIn, verifyCode, verifyUser, sendForgotPassword, recoverPassword, changePassword, updateProfile, currentUser } = require('../controllers/userController')
let { addCategory, updateCategory, deleteCategory, getAllCategory, getCategory } = require('../controllers/categoryController')
let { uploadFile, fetchFile, deleteFile } = require('../controllers/fileController')
let { addPost, updatePost, deletePost, postList, getPost } = require('../controllers/postController')

let { validate, signUpValidator, signInValidator, emailValidator, verifyUserValidator, recoverPasswordValidator, changePasswordValidator, updateProfileValidator } = require('../validations/userValidation')
let { addCategoryValidator } = require('../validations/categoryValidator')
let { addPostValidator, updatePostValidator } = require('../validations/postValidator')

let { authentication } = require('../middlewares/auth')
let { upload } = require('../middlewares/multerUpload')
let { awsUpload } = require('../middlewares/awsUpload')

router.get('/test', function (req, res) {
    return res.status(200).send({ status: true, message: "Code is working fine" })
})

// user's api
router.post('/signUp', signUpValidator, validate, signUp)
router.post('/signIn', signInValidator, validate, signIn)
router.post('/verifyCode', emailValidator, validate, verifyCode)
router.post('/verifyUser', verifyUserValidator, validate, verifyUser)
router.post('/sendForgotPassword', emailValidator, validate, sendForgotPassword)
router.post('/recoverPassword', recoverPasswordValidator, validate, recoverPassword)
router.put('/changePassword', changePasswordValidator, validate, authentication, changePassword)
router.put('/updateProfile', updateProfileValidator, validate, authentication, updateProfile)
router.get('/currentUser', authentication, currentUser)

// category
router.post('/addCategory', addCategoryValidator, validate, authentication, addCategory)
router.put('/updateCategory', authentication, updateCategory)
router.delete('/deleteCategory', authentication, deleteCategory)
router.get('/getAllCategory', authentication, getAllCategory)
router.get('/getCategory', authentication, getCategory)

// files
router.post('/uploadFile', authentication, awsUpload.single('image'), uploadFile)
router.get('/fetchFile', authentication, fetchFile)
router.delete('/deleteFile', authentication, deleteFile)

// post
router.post('/addPost', authentication, addPostValidator, validate, addPost)
router.put('/updatePost', authentication, updatePostValidator, validate, updatePost)
router.delete('/deletePost', authentication, deletePost)
router.get('/postList', authentication, postList)
router.get('/getPost', authentication, getPost)

module.exports = router