#!/bin/bash

set -e

echo "Building Lambda functions..."

# Build user-service
echo "Building user-service..."
cd lambda-functions/user-service
npm install
npm run build
npm run package
mv user-service-latest.zip ../../deployments/artifacts/
cd ../..

# Build order-service
echo "Building order-service..."
cd lambda-functions/order-service
npm install
npm run build
npm run package
mv order-service-latest.zip ../../deployments/artifacts/
cd ../..

echo "All Lambda functions built successfully!"
echo "Artifacts available in deployments/artifacts/"
