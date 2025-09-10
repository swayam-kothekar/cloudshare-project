// // const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// // // Initialize the S3 client
// // const s3Client = new S3Client({ region: process.env.AWS_REGION, });

// // const generateShortUrl = async (req, res) => {
// //     const { longUrl, shortUrl } = req.body;

// //     if (!longUrl || !shortUrl) {
// //         return res.status(400).json({ error: 'Long URL and short URL are required' });
// //     }
    
// //     const command = new PutObjectCommand({
// //         Bucket: "share.swayam.tech",
// //         Key: shortUrl,
// //         WebsiteRedirectLocation: longUrl,
// //         ContentLength: 0,
// //     });


// //     try {
// //         await s3Client.send(command);
// //         const shortenedUrl = `http://share.swayam.tech/${shortUrl}`;

// //         res.status(200).json({ shortenedUrl });
// //     } catch (err) {
// //         console.error(`Error generating shortened URL: ${err.message}`);
// //         res.status(500).json({ error: err.message });
// //     }
// // }

// // module.exports = { generateShortUrl };


// const { S3Client, PutObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
// const s3Client = new S3Client({ region: process.env.AWS_REGION, });

// const generateShortUrl = async (req, res) => {
//     const { longUrl, shortUrl } = req.body;

//     if (!longUrl || !shortUrl) {
//         return res.status(400).json({ error: 'Long URL and short URL are required' });
//     }
    
//     try {
//         // Check if an object with the same shortUrl already exists
//         const headCommand = new HeadObjectCommand({
//             Bucket: "cloudshare-shorten-url",
//             Key: shortUrl
//         });

//         try {
//             await s3Client.send(headCommand);
//             // If the above line doesn't throw an error, it means the object exists
//             return res.status(409).json({ error: 'This short URL is already in use' });
//         } catch (err) {
//             // If we've reached here, the object doesn't exist, so we can create it
//         const putCommand = new PutObjectCommand({
//             Bucket: "cloudshare-shorten-url",
//             Key: shortUrl,
//             WebsiteRedirectLocation: longUrl,
//             ContentLength: 0,
//         });

//         await s3Client.send(putCommand);
//         const shortenedUrl = `http://cloudshare.swayam.tech/${shortUrl}`;

//         res.status(200).json({ shortenedUrl });
//         }
        
        
//     } catch (err) {
//         console.error(`Error generating shortened URL: ${err.message}`);
//         res.status(500).json({ error: err.message });
//     }
// }

// module.exports = { generateShortUrl };



const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = "shortened-urls";

const generateShortUrl = async (req, res) => {
    const { longUrl, shortUrl} = req.body;

    if (!longUrl || !shortUrl ) {
        return res.status(400).json({ error: 'Long URL and short URL are required' });
    }

    try {
        // Check if the shortUrl already exists
        const getCommand = new GetCommand({
            TableName: TABLE_NAME,
            Key: { shortUrl }
        });

        const existingItem = await docClient.send(getCommand);

        if (existingItem.Item) {
            return res.status(409).json({ error: 'This short URL is already in use' });
        }

        // If we've reached here, the shortUrl doesn't exist, so we can create it
        const putCommand = new PutCommand({
            TableName: TABLE_NAME,
            Item: {
                shortUrl,
                longUrl,
                createdAt: new Date().toISOString()
            }
        });

        await docClient.send(putCommand);
        const shortenedUrl = `https://cloudshare.swayamk.dev/share/${shortUrl}`;

        res.status(200).json({ shortenedUrl });
    } catch (err) {
        console.error(`Error generating shortened URL: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

const redirectToLongUrl = async (req, res) => {
    const { shortUrl } = req.params;
    console.log(shortUrl)

    try {
        const getCommand = new GetCommand({
            TableName: TABLE_NAME,
            Key: { shortUrl }
        });

        const result = await docClient.send(getCommand);
        console.log(result)

        if (result.Item) {
            res.redirect(301, result.Item.longUrl);
            console.log(result.Item.longUrl)
        } else {
            res.status(404).json({ error: 'Short URL not found' });
        }
    } catch (err) {
        console.error(`Error redirecting: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { generateShortUrl, redirectToLongUrl };