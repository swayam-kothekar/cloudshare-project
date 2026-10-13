const { sql } = require('./db');

const generateShortUrl = async (req, res) => {
  const { longUrl, shortUrl } = req.body;

  if (!longUrl || !shortUrl) {
    return res.status(400).json({ error: 'Long URL and short URL are required' });
  }

  try {
    const existing = await sql`
      SELECT short_code FROM short_urls WHERE short_code = ${shortUrl} LIMIT 1
    `;

    if (existing.length > 0) {
      return res.status(409).json({ error: 'This short URL is already in use' });
    }

    await sql`
      INSERT INTO short_urls (short_code, long_url, created_at)
      VALUES (${shortUrl}, ${longUrl}, NOW())
    `;

    const shortenedUrl = `${process.env.BACKEND_BASE_URL}/share/${shortUrl}`;
    res.status(200).json({ shortenedUrl });
  } catch (err) {
    console.error(`Error generating shortened URL: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

const redirectToLongUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const records = await sql`
      SELECT long_url FROM short_urls WHERE short_code = ${shortUrl} LIMIT 1
    `;

    if (records.length > 0) {
      return res.redirect(301, records[0].long_url);
    }

    res.status(404).json({ error: 'Short URL not found' });
  } catch (err) {
    console.error(`Error redirecting: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateShortUrl, redirectToLongUrl };