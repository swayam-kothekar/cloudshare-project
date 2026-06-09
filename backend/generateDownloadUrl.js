const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const generateDownloadUrl = async (req, res) => {
  const { keyName, expiry } = req.body;

  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: keyName,
  };

  try {
    const downloadUrl = await getSignedUrl(r2Client, new GetObjectCommand(params), { expiresIn: expiry });
    res.status(200).json({ downloadUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateDownloadUrl };
