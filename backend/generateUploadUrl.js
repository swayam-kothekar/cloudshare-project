const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({
  region: "us-east-1",
});

const generateUploadUrl = async (req, res) => {
  const { fileType } = req.body;
  
  const keyName = `${uuidv4()}.encrypted`;

  const params = {
    Bucket: "cloudshare-files",
    Key: keyName,
    ContentType: fileType,
  };

  try {
    const uploadUrl = await getSignedUrl(s3Client, new PutObjectCommand(params), { expiresIn: 900 });
    console.log(uploadUrl);
    res.status(200).json({ uploadUrl, keyName });
  } catch (err) {
    console.error(`Error generating pre-signed URL: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateUploadUrl };