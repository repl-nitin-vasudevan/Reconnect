#!/bin/bash
# Deployment script for uploading files to EC2 instance

EC2_IP="54.160.75.203"
KEY_FILE="deltek-reconnect-key.pem"

echo "Deploying to EC2 instance at $EC2_IP"

# Wait for SSH to be available
echo "Waiting for SSH to be ready..."
while ! ssh -o StrictHostKeyChecking=no -i "$KEY_FILE" ec2-user@$EC2_IP "echo 'SSH is ready'" 2>/dev/null; do
    sleep 5
done

echo "Uploading website files..."

# Create website directory
ssh -i "$KEY_FILE" ec2-user@$EC2_IP "sudo mkdir -p /var/www/deltek-reconnect && sudo chown ec2-user:ec2-user /var/www/deltek-reconnect"

# Copy files (excluding unnecessary ones)
rsync -avz --exclude '.git' --exclude '*.sh' --exclude '*.md' --exclude '.DS_Store' --exclude 'visual-test.html' \
    -e "ssh -i $KEY_FILE" \
    ./ ec2-user@$EC2_IP:/var/www/deltek-reconnect/

# Copy the Python server script
scp -i "$KEY_FILE" serve.py ec2-user@$EC2_IP:/var/www/deltek-reconnect/

# Restart the service
ssh -i "$KEY_FILE" ec2-user@$EC2_IP "sudo systemctl restart deltek-website"

echo "✅ Deployment complete!"
echo "🌐 Website available at: http://$EC2_IP:8000"
