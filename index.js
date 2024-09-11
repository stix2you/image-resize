const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const sharp = require('sharp');

exports.handler = async (event) => {
  try {
    // Read data from the event object.
    const region = event.Records[0].awsRegion;
    const sourceBucket = event.Records[0].s3.bucket.name;
    const sourceKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    
    // Define the destination bucket and key.
    const destinationBucket = sourceBucket;
    const destinationKey = `resized-images/${sourceKey.split('/').pop()}`;

    // Get the image from the source S3 bucket.
    const image = await S3.getObject({
      Bucket: sourceBucket,
      Key: sourceKey
    }).promise();
    
    // Resize the image using sharp.
    const resizedImage = await sharp(image.Body)
      .resize(800) // Resize to a width of 800 pixels.
      .toBuffer();
    
    // Upload the resized image to the destination S3 bucket.
    await S3.putObject({
      Bucket: destinationBucket,
      Key: destinationKey,
      Body: resizedImage,
      ContentType: 'image/jpeg' // Adjust this based on the original image type.
    }).promise();

    console.log(`Successfully resized ${sourceBucket}/${sourceKey} and uploaded to ${destinationBucket}/${destinationKey}`);
  } catch (error) {
    console.error(`Error processing ${event.Records[0].s3.bucket.name}/${event.Records[0].s3.object.key}: `, error);
    throw error;
  }
};


// Explanation of the Code
// Read S3 Event Data:
// Extracts the S3 bucket name (sourceBucket) and the key of the image (sourceKey) from the event object triggered by the S3 bucket when a new file is uploaded.
// Get the Image from S3:
// Uses S3.getObject to download the image from the source bucket.
// Resize the Image:
// Utilizes the sharp library to resize the image to a width of 800 pixels while maintaining the aspect ratio.
// Upload the Resized Image:
// Uploads the resized image back to the same S3 bucket under a new prefix (resized-images/).
// Error Handling:
// Catches and logs any errors that occur during the processing.