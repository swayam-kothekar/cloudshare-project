require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateUploadUrl } = require('./generateUploadUrl');
const { generateDownloadUrl } = require('./generateDownloadUrl');
const { generateShortUrl, redirectToLongUrl } = require('./generateShortUrl');
const { tagFile, getDownloadLimit, decrementDownloadLimit } = require('./tagFile');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-upload-url', generateUploadUrl);

app.post('/generate-download-url', generateDownloadUrl);

app.post('/generate-short-url', generateShortUrl);

app.get('/share/:shortUrl', redirectToLongUrl);

app.post('/tag-file', tagFile);

app.get('/get-download-limit', getDownloadLimit);

app.post('/decrement-download-limit', decrementDownloadLimit);

// Only listen when running locally (not on Vercel serverless)
if (require.main === module) {
  app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
}

module.exports = app;