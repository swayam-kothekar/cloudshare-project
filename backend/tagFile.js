const { sql } = require('./db');

const tagFile = async (req, res) => {
  const { keyName, downloadLimit } = req.body;

  try {
    await sql`
      INSERT INTO download_limits (key_name, download_limit, updated_at)
      VALUES (${keyName}, ${parseInt(downloadLimit, 10)}, NOW())
      ON CONFLICT (key_name)
      DO UPDATE SET download_limit = EXCLUDED.download_limit, updated_at = NOW()
    `;
    res.status(200).json({ message: 'Tag added successfully' });
  } catch (err) {
    console.error(`Error adding tag: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

const getDownloadLimit = async (req, res) => {
  const { keyName } = req.query;

  try {
    const rows = await sql`
      SELECT download_limit FROM download_limits WHERE key_name = ${keyName} LIMIT 1
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Download limit not found for this file' });
    }

    res.status(200).json({ downloadLimit: parseInt(rows[0].download_limit, 10) });
  } catch (err) {
    console.error(`Error getting download limit for ${keyName}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

const decrementDownloadLimit = async (req, res) => {
  const { keyName } = req.body;

  try {
    const rows = await sql`
      UPDATE download_limits
      SET download_limit = download_limit - 1, updated_at = NOW()
      WHERE key_name = ${keyName}
      RETURNING download_limit
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Download limit not found for this file' });
    }

    const newLimit = rows[0].download_limit;
    console.log(`Download limit for ${keyName} decreased to ${newLimit}`);
    res.status(200).json({ message: `Download limit for ${keyName} decreased to ${newLimit}` });
  } catch (err) {
    console.error(`Error updating downloadLimit for ${keyName}: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { tagFile, getDownloadLimit, decrementDownloadLimit };