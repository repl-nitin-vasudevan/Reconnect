# AWS Deployment Guide - Deltek India Reconnect 2025 Website

## Table of Contents
1. [Method 1: S3 + CloudFront (Recommended)](#method-1-s3--cloudfront-recommended)
2. [Method 2: EC2 Instance](#method-2-ec2-instance)
3. [Method 3: AWS Amplify (Easiest)](#method-3-aws-amplify-easiest)

---

## Method 1: S3 + CloudFront (Recommended)
**Best for: Static websites, cost-effective, highly scalable**

### Prerequisites
- AWS Account
- AWS CLI installed (`brew install awscli` on Mac)
- AWS credentials configured

### Step 1: Configure AWS CLI
```bash
# Install AWS CLI if not already installed
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configure AWS credentials
aws configure
```
Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Default output format: `json`

### Step 2: Create S3 Bucket

#### Option A: Using AWS Console
1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. Bucket name: `deltek-reconnect-2025` (must be globally unique)
4. Region: Select your preferred region
5. Uncheck "Block all public access"
6. Acknowledge the warning
7. Keep other settings default
8. Click "Create bucket"

#### Option B: Using AWS CLI
```bash
# Create bucket
aws s3 mb s3://deltek-reconnect-2025 --region us-east-1

# Enable static website hosting
aws s3 website s3://deltek-reconnect-2025 \
  --index-document index.html \
  --error-document error.html
```

### Step 3: Configure Bucket Policy
Create a file `bucket-policy.json`:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::deltek-reconnect-2025/*"
        }
    ]
}
```

Apply the policy:
```bash
aws s3api put-bucket-policy \
  --bucket deltek-reconnect-2025 \
  --policy file://bucket-policy.json
```

### Step 4: Upload Website Files

#### Option A: Using AWS CLI
```bash
# Navigate to your website directory
cd /Users/nitin.vasudevan/Claude/Reconnect/Website

# Sync all files to S3
aws s3 sync . s3://deltek-reconnect-2025 \
  --exclude ".git/*" \
  --exclude ".DS_Store" \
  --exclude "*.sh" \
  --exclude "*.py" \
  --exclude "*.md" \
  --exclude "visual-test.html" \
  --acl public-read

# Set correct content types
aws s3 cp s3://deltek-reconnect-2025/ s3://deltek-reconnect-2025/ \
  --recursive \
  --exclude "*" \
  --include "*.js" \
  --content-type "application/javascript" \
  --metadata-directive REPLACE \
  --acl public-read

aws s3 cp s3://deltek-reconnect-2025/ s3://deltek-reconnect-2025/ \
  --recursive \
  --exclude "*" \
  --include "*.html" \
  --content-type "text/html" \
  --metadata-directive REPLACE \
  --acl public-read

aws s3 cp s3://deltek-reconnect-2025/ s3://deltek-reconnect-2025/ \
  --recursive \
  --exclude "*" \
  --include "*.css" \
  --content-type "text/css" \
  --metadata-directive REPLACE \
  --acl public-read
```

#### Option B: Using AWS Console
1. Go to your S3 bucket in AWS Console
2. Click "Upload"
3. Drag and drop all files from your website directory
4. Click "Additional upload options"
5. Under "Access control list", select "Grant public read access"
6. Click "Upload"

### Step 5: Create CloudFront Distribution

#### Using AWS Console:
1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click "Create Distribution"
3. Configure:
   - **Origin Domain**: Select your S3 bucket
   - **Origin Path**: Leave empty
   - **Name**: `Deltek Reconnect 2025`
   - **S3 Bucket Access**: "Yes use OAI" (recommended) or "Public"
   - **Create new OAI**: Yes
   - **Bucket Policy**: "Yes, update the bucket policy"
   - **Viewer Protocol Policy**: "Redirect HTTP to HTTPS"
   - **Allowed HTTP Methods**: GET, HEAD
   - **Cache Policy**: "CachingOptimized"
   - **Default Root Object**: `index.html`
4. Click "Create Distribution"

#### Using AWS CLI:
```bash
aws cloudfront create-distribution \
  --origin-domain-name deltek-reconnect-2025.s3.amazonaws.com \
  --default-root-object index.html
```

### Step 6: Access Your Website
- **S3 URL**: `http://deltek-reconnect-2025.s3-website-[region].amazonaws.com`
- **CloudFront URL**: `https://[distribution-id].cloudfront.net`

CloudFront takes 15-20 minutes to deploy globally.

---

## Method 2: EC2 Instance
**Best for: Dynamic content, server-side processing, more control**

### Step 1: Launch EC2 Instance

#### Using AWS Console:
1. Go to [EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click "Launch Instance"
3. Configure:
   - **Name**: `Deltek-Reconnect-Server`
   - **AMI**: Amazon Linux 2023 or Ubuntu 22.04 LTS
   - **Instance Type**: `t2.micro` (free tier) or `t3.small`
   - **Key Pair**: Create new or use existing
   - **Network Settings**:
     - Allow SSH (port 22)
     - Allow HTTP (port 80)
     - Allow HTTPS (port 443)
   - **Storage**: 8-20 GB
4. Click "Launch Instance"

### Step 2: Connect to Instance
```bash
# Set permissions for key file
chmod 400 your-key-pair.pem

# Connect via SSH
ssh -i your-key-pair.pem ec2-user@[public-ip-address]
# Or for Ubuntu:
ssh -i your-key-pair.pem ubuntu@[public-ip-address]
```

### Step 3: Install Web Server

#### For Amazon Linux 2023:
```bash
# Update system
sudo yum update -y

# Install Python and Git
sudo yum install python3 git -y

# Clone your website (you'll need to upload it first)
git clone https://github.com/yourusername/deltek-reconnect.git
# OR use SCP to copy files:
# scp -i your-key-pair.pem -r /Users/nitin.vasudevan/Claude/Reconnect/Website/* ec2-user@[public-ip]:/home/ec2-user/website/
```

#### For Ubuntu:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and Git
sudo apt install python3 python3-pip git -y
```

### Step 4: Set Up Python Server

```bash
# Navigate to website directory
cd website  # or wherever you copied the files

# Install Python server as a service
sudo nano /etc/systemd/system/deltek-website.service
```

Add this content:
```ini
[Unit]
Description=Deltek Reconnect Website
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/website
ExecStart=/usr/bin/python3 /home/ec2-user/website/serve.py 80
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Modify serve.py to accept port 80
sudo nano serve.py
# Change the default port to 80

# Enable and start service
sudo systemctl enable deltek-website
sudo systemctl start deltek-website

# Check status
sudo systemctl status deltek-website
```

### Step 5: Configure Security & Networking

1. **Elastic IP** (Optional but recommended):
```bash
# Allocate Elastic IP in AWS Console
# Associate it with your EC2 instance
```

2. **Domain Name** (Optional):
- Use Route 53 or your domain provider
- Point A record to Elastic IP or Public IP

### Step 6: Install Nginx (Recommended for Production)

```bash
# Install Nginx
sudo yum install nginx -y  # Amazon Linux
# OR
sudo apt install nginx -y  # Ubuntu

# Configure Nginx
sudo nano /etc/nginx/sites-available/deltek
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/deltek /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Method 3: AWS Amplify (Easiest)
**Best for: Quick deployment, automatic CI/CD**

### Step 1: Prepare Your Code
1. Create a GitHub repository
2. Push your code:
```bash
cd /Users/nitin.vasudevan/Claude/Reconnect/Website
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/deltek-reconnect.git
git push -u origin main
```

### Step 2: Deploy with Amplify
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Choose GitHub and authorize
4. Select your repository and branch
5. Configure build settings:
```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - echo "No build required"
  artifacts:
    baseDirectory: /
    files:
      - '**/*'
  cache:
    paths: []
```
6. Click "Save and deploy"

### Step 3: Access Your Site
Amplify provides a URL like: `https://main.d1234567890abc.amplifyapp.com`

---

## Quick Automated Deployment Script

Create `deploy-to-aws-automated.sh`:
```bash
#!/bin/bash

# Configuration
BUCKET_NAME="deltek-reconnect-2025-$(date +%s)"
REGION="us-east-1"

echo "🚀 Deploying Deltek Reconnect 2025 to AWS..."

# Create S3 bucket
echo "📦 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document error.html

# Create bucket policy
echo "🔓 Setting bucket policy..."
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

aws s3api put-bucket-policy \
  --bucket $BUCKET_NAME \
  --policy file:///tmp/bucket-policy.json

# Upload files
echo "📤 Uploading website files..."
aws s3 sync . s3://$BUCKET_NAME \
  --exclude ".git/*" \
  --exclude ".DS_Store" \
  --exclude "*.sh" \
  --exclude "*.py" \
  --exclude "*.md" \
  --exclude "visual-test.html" \
  --acl public-read

# Create CloudFront distribution
echo "☁️ Creating CloudFront distribution..."
DISTRIBUTION_ID=$(aws cloudfront create-distribution \
  --origin-domain-name $BUCKET_NAME.s3.amazonaws.com \
  --default-root-object index.html \
  --query 'Distribution.Id' \
  --output text)

echo "✅ Deployment Complete!"
echo "📍 S3 URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "🔒 CloudFront URL: https://$DISTRIBUTION_ID.cloudfront.net"
echo "⏰ Note: CloudFront distribution takes 15-20 minutes to be fully available"
```

Make it executable and run:
```bash
chmod +x deploy-to-aws-automated.sh
./deploy-to-aws-automated.sh
```

---

## Cost Estimates

### S3 + CloudFront
- **S3 Storage**: ~$0.023/GB/month (first 50TB)
- **S3 Requests**: ~$0.0004 per 1,000 requests
- **CloudFront**: ~$0.085/GB data transfer
- **Estimated Monthly Cost**: $1-5 for low traffic

### EC2 Instance
- **t2.micro**: Free tier (750 hours/month for 12 months)
- **t3.small**: ~$15/month
- **Storage**: ~$0.10/GB/month
- **Data Transfer**: First 1GB free, then ~$0.09/GB

### AWS Amplify
- **Build & Deploy**: $0.01 per build minute
- **Hosting**: $0.023/GB stored, $0.15/GB served
- **Estimated Monthly Cost**: $1-5 for low traffic

---

## Troubleshooting

### S3 Issues
```bash
# Check bucket policy
aws s3api get-bucket-policy --bucket your-bucket-name

# Check website configuration
aws s3api get-bucket-website --bucket your-bucket-name

# List bucket contents
aws s3 ls s3://your-bucket-name --recursive
```

### EC2 Issues
```bash
# Check instance status
aws ec2 describe-instance-status --instance-id i-1234567890abcdef0

# Check security groups
aws ec2 describe-security-groups --group-ids sg-1234567890abcdef0

# View system logs
sudo journalctl -u deltek-website -f
```

### CloudFront Issues
```bash
# Check distribution status
aws cloudfront get-distribution --id ABCDEFG1234567

# Create invalidation (clear cache)
aws cloudfront create-invalidation \
  --distribution-id ABCDEFG1234567 \
  --paths "/*"
```

---

## Security Best Practices

1. **Enable AWS CloudTrail** for audit logging
2. **Use IAM roles** instead of access keys when possible
3. **Enable S3 versioning** for backup
4. **Set up CloudFront WAF** for DDoS protection
5. **Use HTTPS only** via CloudFront
6. **Regular security updates** for EC2 instances
7. **Enable MFA** on AWS account

---

## Next Steps

1. **Custom Domain**: Add your domain via Route 53
2. **SSL Certificate**: Use AWS Certificate Manager (free)
3. **Monitoring**: Set up CloudWatch alarms
4. **Backup**: Enable S3 versioning and lifecycle policies
5. **CDN Optimization**: Configure CloudFront behaviors for better caching

---

*For support, refer to [AWS Documentation](https://docs.aws.amazon.com/) or contact AWS Support.*