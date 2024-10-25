#!/bin/bash

# Generate self-signed certificate for development
openssl req -x509 \
    -nodes \
    -days 365 \
    -newkey rsa:2048 \
    -keyout server.key \
    -out server.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" \
    -addext "subjectAltName = DNS:localhost,IP:127.0.0.1"

# Set proper permissions
chmod 600 server.key
chmod 644 server.crt

echo "SSL certificate and key generated successfully"
