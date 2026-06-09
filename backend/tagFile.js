const { Redis } = require('@upstash/redis');


const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const LIMIT_PREFIX = 'downloadlimit:';

const tagFile = async (req, res) => {
  const { keyName, downloadLimit } = req.body;

  try {
    await redis.set(`${LIMIT_PREFIX}${keyName}`, String(downloadLimit));
    res.status(200).json({ message: 'Tag added successfully' });
  } catch (err) {
    console.error(`Error adding tag: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

const getDownloadLimit = async (req, res) => {
  const { keyName } = req.query;

  try {
    const value = await redis.get(`${LIMIT_PREFIX}${keyName}`);
    if (value === null) {
      return res.status(404).json({ error: 'Download limit not found for this file' });
    }
    res.status(200).json({ downloadLimit: parseInt(value, 10) });
  } catch (err) {
    console.error(`Error getting download limit for ${keyName}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

const decrementDownloadLimit = async (req, res) => {
  const { keyName } = req.body;

  try {
    const newLimit = await redis.decr(`${LIMIT_PREFIX}${keyName}`);
    console.log(`Download limit for ${keyName} decreased to ${newLimit}`);
    res.status(200).json({ message: `Download limit for ${keyName} decreased to ${newLimit}` });
  } catch (err) {
    console.error(`Error updating downloadLimit for ${keyName}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { tagFile, getDownloadLimit, decrementDownloadLimit };