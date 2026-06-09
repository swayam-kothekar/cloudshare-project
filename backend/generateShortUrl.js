const { Redis } = require('@upstash/redis');


const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const KEY_PREFIX = 'shorturl:';

const generateShortUrl = async (req, res) => {
  const { longUrl, shortUrl } = req.body;

  if (!longUrl || !shortUrl) {
    return res.status(400).json({ error: 'Long URL and short URL are required' });
  }

  try {
    const existing = await redis.get(`${KEY_PREFIX}${shortUrl}`);

    if (existing) {
      return res.status(409).json({ error: 'This short URL is already in use' });
    }

    await redis.set(`${KEY_PREFIX}${shortUrl}`, JSON.stringify({
      longUrl,
      createdAt: new Date().toISOString(),
    }));

    const shortenedUrl = `${process.env.BASE_URL}/share/${shortUrl}`;
    res.status(200).json({ shortenedUrl });
  } catch (err) {
    console.error(`Error generating shortened URL: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

const redirectToLongUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const record = await redis.get(`${KEY_PREFIX}${shortUrl}`);

    if (record) {
      const { longUrl } = typeof record === 'string' ? JSON.parse(record) : record;
      return res.redirect(301, longUrl);
    }

    res.status(404).json({ error: 'Short URL not found' });
  } catch (err) {
    console.error(`Error redirecting: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateShortUrl, redirectToLongUrl };