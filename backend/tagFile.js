const { S3Client, PutObjectTaggingCommand, GetObjectTaggingCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({
  region: "us-east-1",
});

const tagFile = async (req, res) => {
  const { keyName, downloadLimit } = req.body;

  const params = {
    Bucket: "cloudshare-files",
    Key: keyName,
    Tagging: {
    TagSet: [
      {
        Key: "downloadLimit",
        Value: downloadLimit
      }
    ]
  }
  };

  try {
    await s3Client.send(new PutObjectTaggingCommand(params));
    res.status(200).json({ message: 'Tag added successfully' });
  } catch (err) {
    console.error(`Error adding tag: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};



// Function to get the downloadLimit tag value
const getDownloadLimit = async (req,res) => {
  const { keyName } = req.query;

  const params = {
    Bucket: "cloudshare-files",
    Key: keyName
  };

  try {
    const data = await s3Client.send(new GetObjectTaggingCommand(params));
    const downloadLimitValue = parseInt(data.TagSet.find(tag => tag.Key === 'downloadLimit').Value, 10);
    // return downloadLimitTag ? parseInt(downloadLimitTag.Value, 10) : null;
    res.status(200).json({ downloadLimit: downloadLimitValue });
  } catch (err) {
    console.error(`Error getting tags for ${keyName}: ${err.message}`);
    res.status(500).json({error: err.message});
  }
};

// Function to update the downloadLimit tag by reducing its value by one
const decrementDownloadLimit = async (req,res) => {
  const { keyName } = req.body;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: keyName
  };

  try {
    const data = await s3Client.send(new GetObjectTaggingCommand(params));
    const currentLimit = parseInt(data.TagSet.find(tag => tag.Key === 'downloadLimit').Value, 10);
    // if (currentLimit === null) {
    //   res.status(200).json({err: "DownloadTag not found"})
    // }
    // if (currentLimit <= 0) {
    //   res.status(200).json({err: "Download limit reached!"})
    // }
    const newLimit = currentLimit - 1;

    const newParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: keyName,
      Tagging: {
      TagSet: [
        {
          Key: "downloadLimit",
          Value: newLimit
        }
      ]
    }
    };
    await s3Client.send(new PutObjectTaggingCommand(newParams));
    console.log(`Download limit for ${keyName} decreased to ${newLimit}`);
    res.status(200).json({ message: `Download limit for ${keyName} decreased to ${newLimit}` });
  } catch (err) {
    console.error(`Error updating downloadLimit for ${keyName}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { tagFile, getDownloadLimit, decrementDownloadLimit };