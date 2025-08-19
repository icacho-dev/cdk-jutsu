#!/bin/bash

# Development Environment Setup Script
# Ensures all dependencies are available for local Lambda development

set -e

echo "🔧 Setting up development environment..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node --version)
echo "   Node.js: $node_version"

if [[ ! "$node_version" =~ ^v1[89] ]] && [[ ! "$node_version" =~ ^v2[0-9] ]]; then
    echo "⚠️  Warning: Node.js 18+ recommended for Lambda development"
fi

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Verify Lambda handler can be loaded
echo "🧪 Verifying Lambda handler..."
if [ -f "dist/lambda/hello-world.js" ]; then
    echo "✅ Lambda handler built successfully"
else
    echo "❌ Lambda handler build failed"
    exit 1
fi

# Check if Docker is available (optional)
echo "🐳 Checking Docker availability..."
if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        echo "✅ Docker is available and running"
        echo "   You can use: npm run sam:lambda (requires SAM CLI)"
    else
        echo "⚠️  Docker is installed but not running"
        echo "   Start Docker to use: npm run sam:lambda"
    fi
else
    echo "ℹ️  Docker not found (optional for basic development)"
fi

# Create events directory if it doesn't exist
mkdir -p events

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "Available commands:"
echo "  npm run local api      - Test with API Gateway event (recommended)"
echo "  npm run local simple   - Test with empty event"
echo "  npm run local event <file.json> - Test with custom event"
echo "  npm run sam:lambda     - SAM CLI demo (shows ES modules limitation)"
echo "  npm test              - Run test suite"
echo "  npm run synth         - Generate CDK CloudFormation template"
echo ""
echo "🔧 Features:"
echo "  ✅ Automatic AWS SDK mocks (no credentials needed)"
echo "  ⚡ Instant Lambda execution"
echo "  📦 Realistic S3 bucket responses"
echo "  🛠️ SAM CLI integration (educational - shows ES modules limitation)"
echo "" 