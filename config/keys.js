let {port, database, jwt, emailUser, emailPass, Aws_Access_Key, Aws_Secret_Key, Aws_Bucket_Name, Aws_Region} = process.env

module.exports = {port: port, url: database, secret: jwt, user: emailUser, pass: emailPass, accessKey: Aws_Access_Key, secretKey: Aws_Secret_Key, bucketName: Aws_Bucket_Name, region: Aws_Region}