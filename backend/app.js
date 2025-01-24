const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateUploadUrl } = require('./generateUploadUrl');
const { generateDownloadUrl } = require('./generateDownloadUrl');
const { generateShortUrl, redirectToLongUrl } = require('./generateShortUrl');
const { tagFile, getDownloadLimit, decrementDownloadLimit } = require('./tagFile');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.options('*', cors());

app.post('/generate-upload-url', generateUploadUrl);

app.post('/generate-download-url', generateDownloadUrl);

app.post('/generate-short-url', generateShortUrl);

app.get('/share/:shortUrl', redirectToLongUrl);

app.post('/tag-file', tagFile);

app.get('/get-download-limit', getDownloadLimit);

app.post('/decrement-download-limit', decrementDownloadLimit);

app.listen(3000)

module.exports = app;