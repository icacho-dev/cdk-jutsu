#!/bin/bash

echo "🧹 Cleaning up TypeScript compilation artifacts..."

# Remove stray .js files (keep jest.config.js and node_modules)
find . -name "*.js" \
  -not -path "./node_modules/*" \
  -not -path "./*/node_modules/*" \
  -not -path "./cdk.out/*" \
  -not -path "./dist/*" \
  -not -name "jest.config.js" \
  -delete

# Remove stray .d.ts files  
find . -name "*.d.ts" \
  -not -path "./node_modules/*" \
  -not -path "./*/node_modules/*" \
  -not -path "./cdk.out/*" \
  -not -path "./dist/*" \
  -delete

# Remove stray .js.map files
find . -name "*.js.map" \
  -not -path "./node_modules/*" \
  -not -path "./*/node_modules/*" \
  -not -path "./cdk.out/*" \
  -not -path "./dist/*" \
  -delete

# Remove stray .d.ts.map files
find . -name "*.d.ts.map" \
  -not -path "./node_modules/*" \
  -not -path "./*/node_modules/*" \
  -not -path "./cdk.out/*" \
  -not -path "./dist/*" \
  -delete

echo "🧹 Cleaning up CDK output directories..."

# Remove CDK output and dist directories
rm -rf cdk.out
rm -rf dist

echo "🧹 Cleaning up Lambda function dist directories..."

# Remove Lambda function dist directories
rm -rf lambda-functions/user-service/dist
rm -rf lambda-functions/order-service/dist

echo "🧹 Cleaning up SAM build artifacts..."

# Remove SAM build artifacts
rm -rf .aws-sam

echo "✅ Cleanup complete!"
echo ""
echo "Note: After cleanup, run the following to rebuild:"
echo "  npm run script:build-lambdas  # Build all Lambda functions"
echo "  npm run dev:local             # Start local development server"
