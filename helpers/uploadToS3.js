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
async function saveToS3(userId, recipeId, images, addedPath) {
    for (let i = 0; i < images.length; i++) {
        const path = userId + '/' + addedPath + recipeId + '/' + Date.now()

        let params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: path ,
            Body: images[i]
        };
        try {
            const S3Response = await s3.upload(params).promise()
            console.log('s3 Response:', S3Response);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = saveToS3;