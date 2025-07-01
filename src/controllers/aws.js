let { PutObjectCommand, S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
let { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
let { region, accessKey, secretKey, bucketName } = require('../../config/keys')

let client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
    }
})

let upload = async function ({ file, ext }) {
    let key = `${Date.now()}${ext}`
    let params = {
        Bucket: bucketName,
        Body: file.buffer,
        Key: key,
        ContentType: file.mimetype
    }

    let command = new PutObjectCommand(params)

    try {
        await client.send(command)
        return key
    } catch (error) {
        console.log(error)
    }
}

let signedUrl = async (key) => {
    let params = {
        Bucket: bucketName,
        Key: key,
    }

    let command = new GetObjectCommand(params)

    try {
        let url = await signedUrl(client, command, { expiresIn: 60 })
        return url
    } catch (error) {
        console.log(error)
    }
}

let fileDelete = async (key) =>{
    let params = {
        Bucket: bucketName,
        Key: key,
    }

    let command = new DeleteObjectCommand(params)

    try {
        await client.send(command)      
        return  
    } catch (error) {
        console.log(error)
    }
}

module.exports = { upload, signedUrl, fileDelete }