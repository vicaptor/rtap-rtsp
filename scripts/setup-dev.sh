#!/bin/bash

# Exit on error
set -e

# Install system dependencies
if [ -x "$(command -v apt-get)" ]; then
    # Debian/Ubuntu
    sudo apt-get update
    sudo apt-get install -y \
        docker.io \
        docker compose \
        golang \
        nodejs \
        npm \
        k6
elif [ -x "$(command -v yum)" ]; then
    # RHEL/CentOS
    sudo yum install -y \
        docker \
        docker compose \
        golang \
        nodejs \
        npm
    # Install k6
    sudo dnf install https://dl.k6.io/rpm/repo.rpm
    sudo dnf install k6
fi

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Node.js dependencies
cd services/annotation-service && npm install
cd ../../client-sdk && npm install
cd ../tests && npm install

# Initialize Git hooks
if [ -d ".git" ]; then
    # Copy pre-commit hook
    cp scripts/hooks/pre-commit .git/hooks/
    chmod +x .git/hooks/pre-commit
fi

# Generate SSL certificates for development
cd services/api-gateway/ssl && ./generate-cert.sh

echo "Development environment setup complete!"
echo "Please log out and log back in for docker group changes to take effect."
