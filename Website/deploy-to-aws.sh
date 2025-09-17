#!/bin/bash

# AWS S3 Static Website Deployment Script
# This script deploys the website to AWS S3 with CloudFront distribution

set -e

# Configuration
BUCKET_NAME="deltek-india-reconnect-2025-copy"
REGION="us-east-1"
CLOUDFRONT_ORIGIN_ID="S3-${BUCKET_NAME}"

echo "🚀 Starting AWS deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure'"
    exit 1
fi

echo "📦 Creating S3 bucket..."
# Create S3 bucket if it doesn't exist
if ! aws s3 ls "s3://${BUCKET_NAME}" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "Bucket ${BUCKET_NAME} already exists"
else
    aws s3 mb "s3://${BUCKET_NAME}" --region "${REGION}"
    echo "✅ Bucket created: ${BUCKET_NAME}"
fi

echo "🔧 Configuring bucket for static website hosting..."
# Enable static website hosting
aws s3 website "s3://${BUCKET_NAME}" \
    --index-document index.html \
    --error-document error.html

# Create bucket policy for public read access
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket "${BUCKET_NAME}" --policy file://bucket-policy.json
rm bucket-policy.json

echo "📤 Uploading website files..."
# Upload HTML files
aws s3 cp index.html "s3://${BUCKET_NAME}/" \
    --content-type "text/html" \
    --cache-control "max-age=3600"

aws s3 cp sw.js "s3://${BUCKET_NAME}/" \
    --content-type "application/javascript" \
    --cache-control "max-age=3600"

# Upload JavaScript files
aws s3 sync js/ "s3://${BUCKET_NAME}/js/" \
    --content-type "application/javascript" \
    --cache-control "max-age=31536000"

# Upload CSS files
aws s3 sync css/ "s3://${BUCKET_NAME}/css/" \
    --content-type "text/css" \
    --cache-control "max-age=31536000"

# Upload fonts if they exist
if [ -d "fonts" ]; then
    aws s3 sync fonts/ "s3://${BUCKET_NAME}/fonts/" \
        --cache-control "max-age=31536000"
fi

# Upload public files if they exist
if [ -d "public" ]; then
    aws s3 sync public/ "s3://${BUCKET_NAME}/public/" \
        --cache-control "max-age=31536000"
fi

echo "🌐 Setting up CloudFront distribution..."
# Create CloudFront distribution configuration
cat > cloudfront-config.json << EOF
{
    "CallerReference": "deltek-reconnect-$(date +%s)",
    "Comment": "Deltek India Reconnect 2025 Copy",
    "Enabled": true,
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "${CLOUDFRONT_ORIGIN_ID}",
                "DomainName": "${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "DefaultRootObject": "index.html",
    "DefaultCacheBehavior": {
        "TargetOriginId": "${CLOUDFRONT_ORIGIN_ID}",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"]
        },
        "Compress": true,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000
    },
    "PriceClass": "PriceClass_100"
}
EOF

# Create CloudFront distribution
DISTRIBUTION_ID=$(aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json \
    --query 'Distribution.Id' \
    --output text 2>/dev/null || echo "")

if [ -n "$DISTRIBUTION_ID" ]; then
    echo "✅ CloudFront distribution created: ${DISTRIBUTION_ID}"
    
    # Get CloudFront domain
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
        --id "${DISTRIBUTION_ID}" \
        --query 'Distribution.DomainName' \
        --output text)
    
    echo ""
    echo "🎉 Deployment successful!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📍 S3 Website URL:"
    echo "   http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"
    echo ""
    echo "🔒 CloudFront URL (HTTPS):"
    echo "   https://${CLOUDFRONT_DOMAIN}"
    echo ""
    echo "⏳ Note: CloudFront distribution may take 15-20 minutes to fully deploy"
else
    echo ""
    echo "⚠️  CloudFront distribution creation skipped (may already exist)"
    echo ""
    echo "📍 S3 Website URL:"
    echo "   http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"
fi

rm -f cloudfront-config.json

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"