const AWS = require('aws-sdk')

// AWS SDK Configuration
AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion : process.env.AWS_API_VERSION
});

// Creating an S3 instance
const s3 = new AWS.S3({apiVersion: process.env.AWS_API_VRSION});

// Getting the file from request and uploading to S3 Bucket
async function uploadToS3(userId, recipeId, images, addedPath) {
    console.log('in upload func');
    let namesArr = []
    for (let i = 0; i < images.length; i++) {
        namesArr.push(Date.now())
        const path = userId + '/' + addedPath + recipeId + '/' + namesArr[i]

        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: path ,
            Body: images[i]
        };
        try {
            console.log('Uploading image number', i+1);
            const S3Response = await s3.upload(params).promise()
            console.log('s3 Response:', S3Response);
        } catch (err) {
            console.log(err);
        }
    }
    return namesArr
}

/** Returns an array of images of specific recipe */
async function getFromS3(userId, addedPath, recipe) {
    let images = []
    for (let i = 0; i < recipe.imagesNames.length; i++) {
        const path = userId + '/' + addedPath + recipe._id + '/' + recipe.imagesNames[i]
        console.log('path', path);

        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: path
        };

        try {
            const downloadRes = await s3.getObject(params).promise()
            images.push(downloadRes.Body.toString('utf-8'))
            console.log('s3 Download Response:', downloadRes);
        } catch (err) {
            console.log(err);
        }
    }
    return images
}

module.exports = {uploadToS3, getFromS3};