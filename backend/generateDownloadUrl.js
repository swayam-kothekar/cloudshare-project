const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// require('dotenv').config();

const s3Client = new S3Client({
  region: "us-east-1",
});

const generateDownloadUrl = async (req, res) => {
  const { keyName, expiry } = req.body;
  console.log(expiry)

  const params = {
    Bucket: "cloudshare-files",
    Key: keyName
  };

  try {
    const downloadUrl = await getSignedUrl(s3Client, new GetObjectCommand(params), { expiresIn: expiry });
    res.status(200).json({ downloadUrl });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { generateDownloadUrl };
