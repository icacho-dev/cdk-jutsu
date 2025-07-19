#!/bin/bash

echo "🚀 Starting SAM Local API Gateway..."
echo "This will start the local development server on port 3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "Available endpoints:"
echo "  POST http://localhost:3000/users"
echo "  GET  http://localhost:3000/users/{userId}"
echo "  POST http://localhost:3000/orders"
echo "  GET  http://localhost:3000/orders/{orderId}"
echo ""
echo "Test commands (run in another terminal):"
echo "  curl -X POST http://localhost:3000/users -H \"Content-Type: application/json\" -d '{\"name\": \"John Doe\", \"email\": \"john@example.com\"}'"
echo "  curl http://localhost:3000/users/123"
echo ""

# Start SAM local with the CDK template
sam local start-api -t cdk.out/BetterLambdaStack.template.json --port 3000
