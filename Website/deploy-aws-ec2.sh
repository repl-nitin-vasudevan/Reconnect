#!/bin/bash

# ============================================
# AWS EC2 Deployment Script
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
INSTANCE_NAME="Deltek-Reconnect-Server"
INSTANCE_TYPE="t2.micro"  # Free tier eligible
AMI_ID=""  # Will be auto-detected based on region
REGION="us-east-1"
KEY_NAME="deltek-reconnect-key"
SECURITY_GROUP_NAME="deltek-reconnect-sg"
WEBSITE_DIR="$(pwd)"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}🚀 Deltek Reconnect 2025 - AWS EC2 Deployment${NC}"
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

# Function to get latest Amazon Linux 2023 AMI
get_ami_id() {
    echo -e "${YELLOW}🔍 Finding latest Amazon Linux 2023 AMI...${NC}"
    
    AMI_ID=$(aws ec2 describe-images \
        --owners amazon \
        --filters \
            "Name=name,Values=al2023-ami-*-x86_64" \
            "Name=state,Values=available" \
        --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' \
        --output text \
        --region "$REGION")
    
    if [[ -z "$AMI_ID" ]]; then
        echo -e "${RED}❌ Could not find AMI${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ AMI found: $AMI_ID${NC}"
}

# Function to create or check key pair
manage_key_pair() {
    echo ""
    echo -e "${YELLOW}🔐 Managing SSH key pair...${NC}"
    
    # Check if key pair exists
    if aws ec2 describe-key-pairs --key-names "$KEY_NAME" --region "$REGION" &>/dev/null; then
        echo -e "${GREEN}✅ Key pair '$KEY_NAME' already exists${NC}"
        
        # Check if local key file exists
        if [[ ! -f "${KEY_NAME}.pem" ]]; then
            echo -e "${YELLOW}⚠️  Local key file not found${NC}"
            echo "Please ensure you have the ${KEY_NAME}.pem file"
            echo -n "Continue anyway? (y/n): "
            read -r response
            if [[ "$response" != "y" ]]; then
                exit 1
            fi
        fi
    else
        echo -e "${BLUE}Creating new key pair...${NC}"
        
        # Create key pair and save to file
        aws ec2 create-key-pair \
            --key-name "$KEY_NAME" \
            --query 'KeyMaterial' \
            --output text \
            --region "$REGION" > "${KEY_NAME}.pem"
        
        # Set correct permissions
        chmod 400 "${KEY_NAME}.pem"
        
        echo -e "${GREEN}✅ Key pair created and saved to ${KEY_NAME}.pem${NC}"
        echo -e "${YELLOW}⚠️  IMPORTANT: Keep this file safe! You'll need it to connect to your instance${NC}"
    fi
}

# Function to create security group
create_security_group() {
    echo ""
    echo -e "${YELLOW}🔒 Setting up security group...${NC}"
    
    # Check if security group exists
    SG_ID=$(aws ec2 describe-security-groups \
        --group-names "$SECURITY_GROUP_NAME" \
        --query 'SecurityGroups[0].GroupId' \
        --output text \
        --region "$REGION" 2>/dev/null || echo "")
    
    if [[ -n "$SG_ID" && "$SG_ID" != "None" ]]; then
        echo -e "${GREEN}✅ Security group already exists: $SG_ID${NC}"
    else
        # Create security group
        SG_ID=$(aws ec2 create-security-group \
            --group-name "$SECURITY_GROUP_NAME" \
            --description "Security group for Deltek Reconnect website" \
            --query 'GroupId' \
            --output text \
            --region "$REGION")
        
        echo -e "${BLUE}Created security group: $SG_ID${NC}"
        
        # Add inbound rules
        echo -e "${BLUE}Adding security rules...${NC}"
        
        # SSH access
        aws ec2 authorize-security-group-ingress \
            --group-id "$SG_ID" \
            --protocol tcp \
            --port 22 \
            --cidr 0.0.0.0/0 \
            --region "$REGION"
        
        # HTTP access
        aws ec2 authorize-security-group-ingress \
            --group-id "$SG_ID" \
            --protocol tcp \
            --port 80 \
            --cidr 0.0.0.0/0 \
            --region "$REGION"
        
        # HTTPS access
        aws ec2 authorize-security-group-ingress \
            --group-id "$SG_ID" \
            --protocol tcp \
            --port 443 \
            --cidr 0.0.0.0/0 \
            --region "$REGION"
        
        # Port 8000 for Python server
        aws ec2 authorize-security-group-ingress \
            --group-id "$SG_ID" \
            --protocol tcp \
            --port 8000 \
            --cidr 0.0.0.0/0 \
            --region "$REGION"
        
        echo -e "${GREEN}✅ Security group configured${NC}"
    fi
}

# Function to create user data script
create_user_data() {
    cat > /tmp/user-data.sh <<'EOF'
#!/bin/bash
# Update system
yum update -y

# Install required packages
yum install -y python3 git

# Create website directory
mkdir -p /var/www/deltek-reconnect
cd /var/www/deltek-reconnect

# Create a simple message file (will be replaced with actual files)
echo "Deltek Reconnect 2025 - Server is ready for deployment" > ready.txt

# Install Python server systemd service
cat > /etc/systemd/system/deltek-website.service <<'SERVICE'
[Unit]
Description=Deltek Reconnect Website
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/var/www/deltek-reconnect
ExecStart=/usr/bin/python3 -m http.server 8000
Restart=always
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICE

# Start service
systemctl daemon-reload
systemctl enable deltek-website
systemctl start deltek-website

# Create deployment info
echo "Deployment completed at $(date)" > /var/log/deltek-deploy.log
EOF
}

# Function to launch EC2 instance
launch_instance() {
    echo ""
    echo -e "${YELLOW}🚀 Launching EC2 instance...${NC}"
    
    # Create user data
    create_user_data
    
    # Launch instance
    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id "$AMI_ID" \
        --instance-type "$INSTANCE_TYPE" \
        --key-name "$KEY_NAME" \
        --security-group-ids "$SG_ID" \
        --user-data file:///tmp/user-data.sh \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
        --query 'Instances[0].InstanceId' \
        --output text \
        --region "$REGION")
    
    echo -e "${GREEN}✅ Instance launched: $INSTANCE_ID${NC}"
    
    # Wait for instance to be running
    echo -e "${YELLOW}⏳ Waiting for instance to start...${NC}"
    aws ec2 wait instance-running --instance-ids "$INSTANCE_ID" --region "$REGION"
    
    # Get instance details
    INSTANCE_INFO=$(aws ec2 describe-instances \
        --instance-ids "$INSTANCE_ID" \
        --query 'Reservations[0].Instances[0].[PublicIpAddress,PublicDnsName]' \
        --output text \
        --region "$REGION")
    
    PUBLIC_IP=$(echo "$INSTANCE_INFO" | cut -f1)
    PUBLIC_DNS=$(echo "$INSTANCE_INFO" | cut -f2)
    
    echo -e "${GREEN}✅ Instance is running!${NC}"
    echo -e "${BLUE}Public IP: $PUBLIC_IP${NC}"
    echo -e "${BLUE}Public DNS: $PUBLIC_DNS${NC}"
    
    # Clean up
    rm /tmp/user-data.sh
}

# Function to create deployment script
create_deployment_script() {
    echo ""
    echo -e "${YELLOW}📝 Creating deployment script...${NC}"
    
    cat > deploy-to-ec2.sh <<EOF
#!/bin/bash
# Deployment script for uploading files to EC2 instance

EC2_IP="$PUBLIC_IP"
KEY_FILE="${KEY_NAME}.pem"

echo "Deploying to EC2 instance at \$EC2_IP"

# Wait for SSH to be available
echo "Waiting for SSH to be ready..."
while ! ssh -o StrictHostKeyChecking=no -i "\$KEY_FILE" ec2-user@\$EC2_IP "echo 'SSH is ready'" 2>/dev/null; do
    sleep 5
done

echo "Uploading website files..."

# Create website directory
ssh -i "\$KEY_FILE" ec2-user@\$EC2_IP "sudo mkdir -p /var/www/deltek-reconnect && sudo chown ec2-user:ec2-user /var/www/deltek-reconnect"

# Copy files (excluding unnecessary ones)
rsync -avz --exclude '.git' --exclude '*.sh' --exclude '*.md' --exclude '.DS_Store' --exclude 'visual-test.html' \\
    -e "ssh -i \$KEY_FILE" \\
    ./ ec2-user@\$EC2_IP:/var/www/deltek-reconnect/

# Copy the Python server script
scp -i "\$KEY_FILE" serve.py ec2-user@\$EC2_IP:/var/www/deltek-reconnect/

# Restart the service
ssh -i "\$KEY_FILE" ec2-user@\$EC2_IP "sudo systemctl restart deltek-website"

echo "✅ Deployment complete!"
echo "🌐 Website available at: http://\$EC2_IP:8000"
EOF
    
    chmod +x deploy-to-ec2.sh
    
    echo -e "${GREEN}✅ Deployment script created: deploy-to-ec2.sh${NC}"
}

# Function to display connection instructions
display_instructions() {
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}🎉 EC2 Instance Successfully Created!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo -e "${BLUE}📍 Instance Details:${NC}"
    echo "  Instance ID:    $INSTANCE_ID"
    echo "  Instance Type:  $INSTANCE_TYPE"
    echo "  Public IP:      $PUBLIC_IP"
    echo "  Public DNS:     $PUBLIC_DNS"
    echo ""
    echo -e "${BLUE}🔗 Access URLs:${NC}"
    echo "  HTTP:  http://$PUBLIC_IP:8000"
    echo "  HTTP:  http://$PUBLIC_DNS:8000"
    echo ""
    echo -e "${BLUE}📝 SSH Connection:${NC}"
    echo "  ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP"
    echo ""
    echo -e "${BLUE}📤 Deploy Website:${NC}"
    echo "  Run: ./deploy-to-ec2.sh"
    echo ""
    echo -e "${BLUE}🛠 Useful Commands:${NC}"
    echo "  Check instance status:"
    echo "    aws ec2 describe-instance-status --instance-id $INSTANCE_ID"
    echo ""
    echo "  Stop instance (to save costs):"
    echo "    aws ec2 stop-instances --instance-ids $INSTANCE_ID"
    echo ""
    echo "  Start instance:"
    echo "    aws ec2 start-instances --instance-ids $INSTANCE_ID"
    echo ""
    echo "  Terminate instance (permanent):"
    echo "    aws ec2 terminate-instances --instance-ids $INSTANCE_ID"
    echo ""
    echo -e "${YELLOW}⚠️  Note: The instance will continue running (and incurring charges) until you stop or terminate it${NC}"
    echo ""
    echo -e "${GREEN}📋 Next Steps:${NC}"
    echo "  1. Run ./deploy-to-ec2.sh to upload your website files"
    echo "  2. Visit http://$PUBLIC_IP:8000 to see your website"
    echo "  3. Consider setting up a domain name and SSL certificate"
}

# Function to ask about Elastic IP
setup_elastic_ip() {
    echo ""
    echo -e "${YELLOW}🔧 Optional: Elastic IP Setup${NC}"
    echo "Elastic IPs provide a static IP address that persists even when the instance is stopped."
    echo -n "Would you like to allocate an Elastic IP? (y/n): "
    read -r response
    
    if [[ "$response" == "y" ]]; then
        # Allocate Elastic IP
        ALLOCATION_ID=$(aws ec2 allocate-address \
            --domain vpc \
            --query 'AllocationId' \
            --output text \
            --region "$REGION")
        
        # Associate with instance
        aws ec2 associate-address \
            --instance-id "$INSTANCE_ID" \
            --allocation-id "$ALLOCATION_ID" \
            --region "$REGION"
        
        # Get the new Elastic IP
        ELASTIC_IP=$(aws ec2 describe-addresses \
            --allocation-ids "$ALLOCATION_ID" \
            --query 'Addresses[0].PublicIp' \
            --output text \
            --region "$REGION")
        
        echo -e "${GREEN}✅ Elastic IP allocated: $ELASTIC_IP${NC}"
        echo -e "${YELLOW}Note: This IP will persist even when the instance is stopped${NC}"
        
        # Update the PUBLIC_IP variable
        PUBLIC_IP="$ELASTIC_IP"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}Current directory: $WEBSITE_DIR${NC}"
    echo ""
    
    # Pre-flight checks
    check_aws_cli
    check_aws_credentials
    
    # Get AMI ID
    get_ami_id
    
    # Setup
    manage_key_pair
    create_security_group
    
    # Launch instance
    launch_instance
    
    # Optional Elastic IP
    setup_elastic_ip
    
    # Create deployment script
    create_deployment_script
    
    # Display instructions
    display_instructions
    
    echo ""
    echo -e "${GREEN}✨ Your EC2 instance is ready!${NC}"
}

# Run main function
main