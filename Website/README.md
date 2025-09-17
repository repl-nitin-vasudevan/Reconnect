# Deltek India Reconnect 2025 - Website Copy

This is an exact copy of the Deltek India Reconnect 2025 event website, recreated for deployment on AWS.

## 📁 Project Structure

```
.
├── index.html              # Main HTML file
├── sw.js                   # Service worker
├── js/                     # JavaScript modules
│   ├── index.js           # Main entry point
│   ├── App.js             # Main React component
│   ├── constants.js       # Constants and configuration
│   ├── types.js           # TypeScript type definitions
│   ├── components/        # React components
│   │   ├── IndiaAgenda.js
│   │   ├── SessionModal.js
│   │   ├── SessionCard.js
│   │   ├── Chatbot.js
│   │   ├── HackathonTimer.js
│   │   └── ... (other components)
│   ├── lib/               # Utility libraries
│   │   ├── api.js
│   │   ├── gemini.js
│   │   └── eventInfo.js
│   └── assets/            # Static assets
├── css/                    # Stylesheets
│   └── google-fonts.css
├── serve.py               # Local development server
├── deploy-to-aws.sh       # AWS deployment script
└── README.md              # This file
```

## 🚀 Local Development

### Prerequisites
- Python 3.x
- Modern web browser with ES modules support

### Running Locally

1. Start the local development server:
```bash
python3 serve.py
```

2. Open your browser and navigate to:
```
http://localhost:8000
```

The server includes proper MIME types for JavaScript modules and CORS headers for local development.

**Note:** The server automatically finds an available port if 8000 is in use. You can also specify a custom port:
```bash
python3 serve.py 8080  # Use port 8080 instead
```

## ☁️ AWS Deployment

### Prerequisites
- AWS CLI installed and configured
- AWS account with appropriate permissions for S3 and CloudFront

### Deployment Steps

1. Make the deployment script executable:
```bash
chmod +x deploy-to-aws.sh
```

2. Run the deployment script:
```bash
./deploy-to-aws.sh
```

The script will:
- Create an S3 bucket configured for static website hosting
- Upload all website files with appropriate content types and cache headers
- Create a CloudFront distribution for HTTPS support and global CDN
- Provide you with both S3 and CloudFront URLs

### Accessing the Deployed Website

After deployment, your website will be available at:
- **S3 URL**: `http://deltek-india-reconnect-2025-copy.s3-website-us-east-1.amazonaws.com`
- **CloudFront URL**: `https://[distribution-id].cloudfront.net` (HTTPS enabled)

Note: CloudFront distribution may take 15-20 minutes to fully deploy globally.

## 🔧 Technologies Used

- **Frontend Framework**: React 19.x with ES Modules
- **UI Components**: Custom React components
- **Icons**: Lucide React
- **Fonts**: Google Sans Text
- **AI Integration**: Google Generative AI (Gemini)
- **Hosting**: AWS S3 + CloudFront

## 📱 Features

- ✅ Responsive design for all devices
- ✅ Event agenda with multiple days
- ✅ Session details and speaker information
- ✅ Interactive session cards
- ✅ AI-powered chatbot
- ✅ Hackathon timer
- ✅ Venue maps
- ✅ Live announcements
- ✅ Speaker directory
- ✅ Favorites and personal agenda

## 🔒 Security

- All external dependencies are loaded via HTTPS
- CloudFront provides SSL/TLS encryption
- Content Security Policy headers can be added via CloudFront

## 📝 Notes

- This is a static copy of the original website
- Some dynamic features that require backend APIs may have limited functionality
- The website is optimized for modern browsers with ES module support

## 🆘 Troubleshooting

### Local Server Issues
- Ensure Python 3 is installed: `python3 --version`
- Check if port 8000 is available: `lsof -i :8000`
- Try a different port: Edit `serve.py` and change the port number

### AWS Deployment Issues
- Verify AWS credentials: `aws sts get-caller-identity`
- Check S3 bucket naming (must be globally unique)
- Ensure you have permissions for S3 and CloudFront operations

## 📄 License

This is a copy of the original website for demonstration purposes.