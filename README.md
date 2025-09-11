# **CloudShare - A Cloud-Based File Sharing Platform**

CloudShare is a secure, anonymous, and serverless file-sharing platform designed to simplify file sharing while ensuring privacy. It allows users to upload encrypted files, generate custom short URLs and QR codes, and set expiration times and download limits for their files.

---

## **Live Demo**

Try the platform here: [cloudshare.swayamk.dev](https://cloudshare.swayamk.dev)

---

## **Features**

- **End-to-End Encryption**: Files are encrypted on the client-side using AES before upload and decrypted upon download.
- **Custom Short URLs**: Users can create custom short URLs for easy sharing.
- **QR Code Sharing**: Generate QR codes for effortless file access.
- **Temporary Storage**: Files are stored temporarily on AWS S3 with automatic deletion based on user-defined expiry times.
- **Download Limits**: Set a maximum number of downloads for shared files.
- **Scalable Architecture**: Built with AWS serverless technologies for cost efficiency and scalability.

---

## **Built With**

- **Languages**: JavaScript
- **Frontend**: React, Web Crypto API
- **Backend**: AWS Lambda, AWS API Gateway
- **Cloud Services**: AWS S3, AWS CloudFront
- **Database**: AWS DynamoDB
- **APIs**: AWS SDK
- **Deployment Tools**: Serverless Framework
- **Other**: QR Code Generator Library, HTML5, CSS3

---

## **How It Works**

1. **Multiple File Upload**: Users upload one or more files, which are encrypted on the client-side before being sent to AWS S3 using a presigned URL.
2. **Custom Short URL**: A custom or randomly generated short URL is created and stored in DynamoDB.
3. **File Sharing**: Users receive a shareable link and a QR code for easy access.
4. **Access Control**: Download limits and expiration times are validated before granting file access.
5. **File Download**: Files are decrypted on the client-side after download for added security.

---

## **Current Limitations**

- **File Upload Limit**: Files are limited to 50 MB to align with the AWS Free Tier constraints.

---

## **Challenges Faced**

- Implementing client-side encryption and ensuring browser compatibility.
- Avoiding conflicts in custom short URLs with efficient DynamoDB indexing.
- Balancing scalability and cost optimization within the AWS Free Tier.

---

## **What's Next**

- Increase the file upload limit beyond 50 MB as the platform scales.
- Implement advanced analytics for download tracking.
- Support additional storage providers like Google Cloud and Azure.
- Integrate AI-driven insights for detecting misuse or suspicious activity.

---

## **Acknowledgments**

- Inspiration for the project came from the need for secure and simple file-sharing solutions.
- Thanks to the open-source community for providing tools and frameworks used in this project.
