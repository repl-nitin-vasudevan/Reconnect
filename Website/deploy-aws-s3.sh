#!/bin/bash

# ============================================
# AWS S3 + CloudFront Deployment Script
# Deltek India Reconnect 2025 Website
# ============================================

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="deltek-reconnect-2025"
REGION="us-east-1"
WEBSITE_DIR="$(pwd)"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}🚀 Deltek Reconnect 2025 - AWS S3 Deployment${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Function to check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI is not installed${NC}"
        echo "Please install AWS CLI first:"
        echo "  Mac: brew install awscli"
        echo "  Linux: sudo apt-get install awscli"
        echo "  Or visit: https://aws.amazon.com/cli/"
        exit 1
    fi
    echo -e "${GREEN}✅ AWS CLI found${NC}"
}

# Function to check AWS credentials
check_aws_credentials() {
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}❌ AWS credentials not configured${NC}"
        echo "Please run: aws configure"
        exit 1
    fi
    echo -e "${GREEN}✅ AWS credentials configured${NC}"
    
    # Display account info
    ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
    echo -e "${BLUE}📍 AWS Account: ${ACCOUNT_ID}${NC}"
}

# Function to generate unique bucket name if needed
generate_bucket_name() {
    TIMESTAMP=$(date +%Y%m%d%H%M%S)
    echo "deltek-reconnect-${TIMESTAMP}"
}

# Function to check if bucket exists
check_bucket_exists() {
    if aws s3api head-bucket --bucket "$1" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to create S3 bucket
create_s3_bucket() {
    echo ""
    echo -e "${YELLOW}📦 Setting up S3 bucket...${NC}"
    
    # Check if default bucket name exists
    if check_bucket_exists "$BUCKET_NAME"; then
        echo -e "${YELLOW}⚠️  Bucket $BUCKET_NAME already exists${NC}"
        echo -n "Generate new bucket name? (y/n): "
        read -r response
        if [[ "$response" == "y" ]]; then
            BUCKET_NAME=$(generate_bucket_name)
            echo -e "${BLUE}📝 New bucket name: $BUCKET_NAME${NC}"
        else
            echo -n "Use existing bucket? (y/n): "
            read -r use_existing
            if [[ "$use_existing" != "y" ]]; then
                echo -e "${RED}❌ Deployment cancelled${NC}"
                exit 1
            fi
            return
        fi
    fi
    
    # Create bucket
    echo -e "${BLUE}Creating bucket: $BUCKET_NAME${NC}"
    if [[ "$REGION" == "us-east-1" ]]; then
        aws s3 mb "s3://$BUCKET_NAME"
    else
        aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
    fi
    
    echo -e "${GREEN}✅ Bucket created successfully${NC}"
}

# Function to configure static website hosting
configure_website_hosting() {
    echo ""
    echo -e "${YELLOW}🌐 Configuring static website hosting...${NC}"
    
    aws s3 website "s3://$BUCKET_NAME" \
        --index-document index.html \
        --error-document error.html
    
    echo -e "${GREEN}✅ Website hosting configured${NC}"
}

# Function to set bucket policy
set_bucket_policy() {
    echo ""
    echo -e "${YELLOW}🔓 Setting bucket policy for public access...${NC}"
    
    # Create policy file
    cat > /tmp/bucket-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF
    
    # Apply policy
    aws s3api put-bucket-policy \
        --bucket "$BUCKET_NAME" \
        --policy file:///tmp/bucket-policy.json
    
    # Remove public access block (required for public website)
    aws s3api put-public-access-block \
        --bucket "$BUCKET_NAME" \
        --public-access-block-configuration \
        "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
        2>/dev/null || true
    
    # Clean up
    rm /tmp/bucket-policy.json
    
    echo -e "${GREEN}✅ Bucket policy configured${NC}"
}

# Function to upload files
upload_files() {
    echo ""
    echo -e "${YELLOW}📤 Uploading website files...${NC}"
    
    # Count files
    FILE_COUNT=$(find . -type f \
        -not -path "./.git/*" \
        -not -name "*.sh" \
        -not -name "*.py" \
        -not -name ".DS_Store" \
        -not -name "visual-test.html" \
        -not -name "*.md" | wc -l)
    
    echo -e "${BLUE}📊 Found $FILE_COUNT files to upload${NC}"
    
    # Sync files with progress
    aws s3 sync . "s3://$BUCKET_NAME" \
        --exclude ".git/*" \
        --exclude ".DS_Store" \
        --exclude "*.sh" \
        --exclude "*.py" \
        --exclude "*.md" \
        --exclude "visual-test.html" \
        --exclude "deploy-*" \
        --exclude "serve.py" \
        --acl public-read \
        --delete
    
    # Set correct content types
    echo -e "${BLUE}Setting content types...${NC}"
    
    # JavaScript files
    aws s3 cp "s3://$BUCKET_NAME/" "s3://$BUCKET_NAME/" \
        --recursive \
        --exclude "*" \
        --include "*.js" \
        --content-type "application/javascript" \
        --metadata-directive REPLACE \
        --acl public-read
    
    # HTML files
    aws s3 cp "s3://$BUCKET_NAME/" "s3://$BUCKET_NAME/" \
        --recursive \
        --exclude "*" \
        --include "*.html" \
        --content-type "text/html" \
        --metadata-directive REPLACE \
        --acl public-read
    
    # CSS files
    aws s3 cp "s3://$BUCKET_NAME/" "s3://$BUCKET_NAME/" \
        --recursive \
        --exclude "*" \
        --include "*.css" \
        --content-type "text/css" \
        --metadata-directive REPLACE \
        --acl public-read
    
    echo -e "${GREEN}✅ Files uploaded successfully${NC}"
}

# Function to create CloudFront distribution
create_cloudfront_distribution() {
    echo ""
    echo -e "${YELLOW}☁️  Setting up CloudFront CDN...${NC}"
    echo -n "Create CloudFront distribution? (y/n): "
    read -r response
    
    if [[ "$response" != "y" ]]; then
        echo -e "${YELLOW}⚠️  Skipping CloudFront setup${NC}"
        return
    fi
    
    # Create distribution config
    cat > /tmp/cf-config.json <<EOF
{
    "CallerReference": "deltek-reconnect-$(date +%s)",
    "Comment": "Deltek India Reconnect 2025",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"],
            "CachedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            }
        },
        "Compress": true
    },
    "Enabled": true
}
EOF
    
    # Create distribution
    DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution \
        --distribution-config file:///tmp/cf-config.json 2>/dev/null)
    
    if [[ $? -eq 0 ]]; then
        DISTRIBUTION_ID=$(echo "$DISTRIBUTION_OUTPUT" | grep -o '"Id": "[^"]*"' | head -1 | cut -d'"' -f4)
        DISTRIBUTION_DOMAIN=$(echo "$DISTRIBUTION_OUTPUT" | grep -o '"DomainName": "[^"]*"' | head -1 | cut -d'"' -f4)
        
        echo -e "${GREEN}✅ CloudFront distribution created${NC}"
        echo -e "${BLUE}Distribution ID: $DISTRIBUTION_ID${NC}"
        echo -e "${BLUE}CloudFront URL: https://$DISTRIBUTION_DOMAIN${NC}"
    else
        echo -e "${YELLOW}⚠️  CloudFront creation skipped or failed${NC}"
    fi
    
    # Clean up
    rm /tmp/cf-config.json
}

# Function to display final URLs
display_urls() {
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}🎉 Deployment Complete!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo -e "${BLUE}📍 Your website is now available at:${NC}"
    echo ""
    
    # S3 Website URL
    if [[ "$REGION" == "us-east-1" ]]; then
        S3_URL="http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
    else
        S3_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
    fi
    
    echo -e "${GREEN}S3 URL:${NC} $S3_URL"
    
    if [[ -n "$DISTRIBUTION_DOMAIN" ]]; then
        echo -e "${GREEN}CloudFront URL:${NC} https://$DISTRIBUTION_DOMAIN"
        echo ""
        echo -e "${YELLOW}⏰ Note: CloudFront distribution takes 15-20 minutes to be fully deployed${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}📝 Management Commands:${NC}"
    echo "  Update files:        aws s3 sync . s3://$BUCKET_NAME --delete"
    echo "  View bucket:         aws s3 ls s3://$BUCKET_NAME"
    echo "  Delete deployment:   aws s3 rb s3://$BUCKET_NAME --force"
    
    if [[ -n "$DISTRIBUTION_ID" ]]; then
        echo "  Invalidate cache:    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/*'"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}Current directory: $WEBSITE_DIR${NC}"
    echo ""
    
    # Pre-flight checks
    check_aws_cli
    check_aws_credentials
    
    # Deployment steps
    create_s3_bucket
    configure_website_hosting
    set_bucket_policy
    upload_files
    create_cloudfront_distribution
    display_urls
    
    echo ""
    echo -e "${GREEN}✨ Thank you for using this deployment script!${NC}"
}

# Run main function
main