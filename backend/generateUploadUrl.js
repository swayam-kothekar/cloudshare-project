const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

// R2 uses the S3-compatible API — only the endpoint + credentials change
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const generateUploadUrl = async (req, res) => {
  const { fileType } = req.body;
  const keyName = `${crypto.randomUUID()}.encrypted`;

  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: keyName,
    ContentType: fileType,
  };

  try {
    const uploadUrl = await getSignedUrl(r2Client, new PutObjectCommand(params), { expiresIn: 900 });
    res.status(200).json({ uploadUrl, keyName });
  } catch (err) {
    console.error(`Error generating pre-signed URL: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateUploadUrl };
