const AWS = require('aws-sdk')

// AWS SDK Configuration
AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion : process.env.AWS_API_VRSION
});

// Creating an S3 instance
const s3 = new AWS.S3({apiVersion: process.env.AWS_API_VRSION});

// Getting the file from request and uploading to S3 Bucket
export function saveToS3(recipeId, fileName, fileBody) {
    const path = '/' + recipeId + '/' + fileName

    let params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: path ,
        Body: fileBody
    };
    s3.upload(params, (err, result) => {
        if(err) {
            console.log("Error:", err);
        } else {
            console.log("S3 Response:",result);
        }
    })
}