#!/bin/bash

echo "🚀 Better Lambda Development Environment Setup"
echo "=============================================="

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "❌ SAM CLI is not installed. Please install it first:"
    echo "   brew install aws-sam-cli"
    echo "   Or visit: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    exit 1
fi

echo "✅ SAM CLI is installed"

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    echo "❌ CDK is not installed. Please install it first:"
    echo "   npm install -g aws-cdk"
    exit 1
fi

echo "✅ CDK is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run bootstrap

# Build Lambda functions
echo "🔨 Building Lambda functions..."
npm run script:build-lambdas

# Generate CDK template
echo "🏗️  Generating CDK CloudFormation template..."
npx cdk synth

echo ""
echo "🎉 Setup complete! You can now run:"
echo ""
echo "  npm run dev:local    - Start local API server (Recommended - SAM template)"
echo "  npm run dev          - Start local API server (CDK template)"
echo "  npm run dev:sync     - Start with auto-rebuild on file changes"
echo ""
echo "📚 Recommended: Use 'npm run dev:local' for reliable local development"
echo ""
echo "📚 Test endpoints:"
echo "  POST http://localhost:3000/users"
echo "  GET  http://localhost:3000/users/{userId}"
echo "  POST http://localhost:3000/orders"
echo "  GET  http://localhost:3000/orders/{orderId}"
echo ""
echo "🧪 Example curl commands:"
echo "  curl -X POST http://localhost:3000/users \\"
echo "    -H \"Content-Type: application/json\" \\"
echo "    -d '{\"name\": \"John Doe\", \"email\": \"john@example.com\"}'"
echo ""
echo "  curl http://localhost:3000/users/123"
echo ""
