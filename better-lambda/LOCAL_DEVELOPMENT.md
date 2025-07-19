# Local Development with AWS SAM + CDK

This project uses **AWS CDK** for infrastructure definition and **AWS SAM CLI** for local development. There are two approaches for local development:

1. **SAM Template Approach** (Recommended for local dev) - Uses dedicated template.yaml
2. **CDK Template Approach** - Uses CDK-generated CloudFormation template

## Why CDK + SAM?
2. **Clean builds for troubleshooting** - Run `npm run script:clean` when things get weird- **CDK**: Modern TypeScript infrastructure as code
- **SAM**: Excellent local development and testing tools
- **Best of both worlds**: CDK's power + SAM's local dev experience

## Prerequisites

1. Install AWS CDK:
   ```bash
   npm install -g aws-cdk
   ```

2. Install AWS SAM CLI:
   ```bash
   brew install aws-sam-cli
   ```
   
3. Ensure Docker is running (SAM uses Docker containers to simulate Lambda runtime)

## Quick Start (Recommended: SAM Template)

1. **Initial Setup:**
   ```bash
   npm run script:dev-setup
   ```

2. **Start Local Development Server:**
   ```bash
   npm run dev:local
   ```
   
   This will:
   - Build Lambda function TypeScript code
   - Copy package.json to dist directories
   - Build SAM template
   - Start local API Gateway on `http://localhost:3000`

3. **Alternative: CDK Template Approach:**
   ```bash
   npm run dev
   ```
   
   This uses the CDK-generated CloudFormation template

## Build Commands

- `npm run script:clean` - Clean all compilation artifacts (TypeScript + CDK)
- `npm run clean:cdk` - Clean only CDK output directories
- `npm run script:build-lambdas` - Build Lambda deployment packages
- `npm run sam:build` - Clean build for SAM local development
- `npm run deploy` - Clean build and deploy to AWS

## Local API Testing

Once the local server is running on `http://localhost:3000`, you can test the endpoints:

### REST Client Files (Recommended)

For easy testing, we provide ready-to-use REST client files in the `test-rest-client/` directory:

- **`test-rest-client/users.http`** - User service endpoint tests
- **`test-rest-client/orders.http`** - Order service endpoint tests

#### How to Use REST Client Files

1. **Install VS Code REST Client Extension:**
   - Open VS Code Extensions (Cmd+Shift+X)
   - Search for "REST Client" by Huachao Mao
   - Install the extension

2. **Start Your Local Development Server:**
   ```bash
   npm run dev:local
   ```

3. **Open and Test:**
   - Open `test-rest-client/users.http` or `test-rest-client/orders.http`
   - Click "Send Request" above any HTTP request
   - View the response in the VS Code panel

#### Example Usage:
```http
### Create a new user
POST http://localhost:3000/users
Content-Type: application/json 

{
    "name": "John Doe",
    "email": "john@example.com"
}
```

Click "Send Request" above the POST line, and you'll see the response immediately in VS Code!

### Manual Testing with curl

## Available Endpoints

### User Service
- `POST http://localhost:3000/users` - Create a new user
- `GET http://localhost:3000/users/{userId}` - Get user by ID

### Order Service  
- `POST http://localhost:3000/orders` - Create a new order
- `GET http://localhost:3000/orders/{orderId}` - Get order by ID

## Testing Examples (Manual curl)

**Important**: Make sure your local development server is running first with `npm run dev:local`

> **💡 Tip**: For easier testing, use the REST client files in `test-rest-client/` directory instead of manual curl commands!

### User Service Tests

#### Create a User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "abc123def",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-07-04T12:00:00.000Z"
  }
}
```

#### Get a User
```bash
curl http://localhost:3000/users/123
```

**Expected Response:**
```json
{
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Order Service Tests

#### Create an Order
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "items": [{"name": "Product A", "quantity": 2, "price": 29.99}],
    "total": 59.98
  }'
```

**Expected Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "xyz789abc",
    "userId": "user123",
    "items": [{"name": "Product A", "quantity": 2, "price": 29.99}],
    "total": 59.98,
    "status": "pending",
    "createdAt": "2025-07-04T12:00:00.000Z"
  }
}
```

#### Get an Order
```bash
curl http://localhost:3000/orders/order123
```

**Expected Response:**
```json
{
  "order": {
    "id": "order123",
    "userId": "user123",
    "items": [{"name": "Product A", "quantity": 2, "price": 29.99}],
    "total": 59.98,
    "status": "completed",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Error Testing

#### Test Invalid Endpoints
```bash
# Should return 404
curl http://localhost:3000/invalid-endpoint

# Should return 405 (Method Not Allowed)
curl -X PUT http://localhost:3000/users

# Should return 400 (Bad Request)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{invalid json}'
```

## SAM Commands

- `sam build` - Build the application
- `sam local start-api` - Start local API Gateway
- `sam local invoke` - Invoke a specific function
- `sam sync --watch` - Sync changes with hot reloading
- `sam deploy` - Deploy to AWS (when ready)

## Project Structure

```
better-lambda/
├── cdk.out/
│   └── BetterLambdaStack.template.json  # CDK-generated CloudFormation
├── samconfig.toml                       # SAM configuration
├── template.yaml                        # SAM template for local development
├── scripts/
│   ├── dev-setup.sh                     # Development setup script
│   ├── start-dev-server.sh              # Start development server script
│   └── clean.sh                         # Clean build artifacts script
├── lib/
│   └── better-lambda-stack.ts           # CDK infrastructure code
├── lambda-functions/
│   ├── user-service/
│   │   ├── package.json                 # Development dependencies & scripts
│   │   ├── package-for-lambda.json      # Production-only package.json for Lambda
│   │   ├── tsconfig.json                # TypeScript configuration
│   │   └── src/                         # Source code
│   └── order-service/
│       ├── package.json                 # Development dependencies & scripts
│       ├── package-for-lambda.json      # Production-only package.json for Lambda
│       ├── tsconfig.json                # TypeScript configuration
│       └── src/                         # Source code
└── test-rest-client/
    ├── users.http                       # User service REST client tests
    └── orders.http                      # Order service REST client tests
```

## How It Works

1. **CDK defines infrastructure** in TypeScript (`lib/better-lambda-stack.ts`)
2. **CDK generates CloudFormation** template (`cdk synth`)
3. **SAM uses CDK template** for local development
4. **Same template deploys to AWS** using CDK

## Lambda Packaging

Each Lambda function has two package.json files:

### **`package.json`** (Development)
- Contains TypeScript, dev dependencies, and build scripts
- Used during development and compilation
- Entry point: `"main": "dist/index.js"`

### **`package-for-lambda.json`** (Production)
- **Production-optimized** package.json for Lambda deployment
- Contains only what's needed for Lambda runtime
- Entry point: `"main": "index.js"` (direct reference in dist/)
- Module type: `"type": "commonjs"` for Lambda compatibility
- **No dev dependencies** - keeps deployment package minimal

### **Build Process:**
```bash
# 1. TypeScript compiles to dist/
npm run build

# 2. Production package.json is copied to dist/
cp package-for-lambda.json dist/package.json

# 3. Only dist/ contents are zipped for Lambda
cd dist && zip -r ../service-latest.zip .
```

### **Why Two Files?**
- **Smaller deployment packages** (faster cold starts)
- **Correct entry points** for Lambda runtime
- **No unnecessary dependencies** in production
- **Better separation** of dev vs runtime concerns

> ⚠️ **Important**: Don't delete `package-for-lambda.json` files - they're essential for proper Lambda packaging!

## Debugging

To debug Lambda functions in VS Code:
1. Set breakpoints in your TypeScript code
2. Run `sam local start-api --debug-port 5858 -t cdk.out/BetterLambdaStack.template.json`
3. Attach VS Code debugger to port 5858

## Deployment

When ready to deploy to AWS:
```bash
npx cdk deploy
```

This uses the same infrastructure definition for both local development and production!

## Troubleshooting

### Common Issues

#### "Missing Authentication Token" Error
If you get this error when testing endpoints:
```json
{"message":"Missing Authentication Token"}
```

**Possible causes:**
1. **Wrong endpoint path** - Make sure you're using the correct paths like `/users` not `/user`
2. **Server not running** - Ensure `npm run dev` is running and shows "SAM local start-api"
3. **CDK template missing API Gateway** - Check that your CDK stack includes API Gateway resources

#### "Cannot find module 'index'" Error
If you get this runtime error:
```json
{"errorType":"Runtime.ImportModuleError","errorMessage":"Error: Cannot find module 'index'"}
```

**Solution:** Use the SAM template approach instead of zip files:
1. Use `npm run dev:local` instead of `npm run dev`
2. The template.yaml uses `CodeUri: lambda-functions/user-service/dist/` which works better than zip files
3. Make sure the dist directories contain `package.json` files

**This error occurs because:**
- Node.js 20.x runtime has stricter module resolution
- Zip file packaging can cause module resolution issues
- Using dist directories directly is more reliable for local development

#### CDK/SAM Template Conflicts
If you see function names like `UserServiceFunctionE37B31D4` instead of `CreateUserFunction`:
- You're using the CDK template instead of the SAM template
- Use `npm run dev:local` for the SAM template approach
- Use `npm run dev` for the CDK template approach (may have module loading issues)

#### Port Already in Use
```bash
# Kill any existing SAM processes
pkill -f "sam local"
```

**Possible causes:**
1. **Lambda artifacts not built** - Run `npm run build-lambdas` first
2. **CDK synthesis before artifacts** - CDK needs Lambda zip files to exist before `cdk synth`
3. **Wrong handler configuration** - Check that CDK handler matches the exported function name
4. **Missing dependencies in zip** - Ensure all required modules are included in the Lambda package

**Solutions:**
1. Run the complete build process: `npm run clean && npm run sam:build`
2. Verify artifacts exist: `ls -la deployments/artifacts/`
3. Check zip contents: `unzip -l deployments/artifacts/user-service-latest.zip`
4. Rebuild from scratch: `npm run clean && npm run bootstrap && npm run sam:build`

#### "Could not find function" Error
```json
{"message":"Function not found"}
```

**Solutions:**
1. Run `npm run clean && npm run sam:build` to rebuild everything
2. Check that Lambda functions compiled successfully in `lambda-functions/*/dist/`
3. Verify the CDK template includes your Lambda functions

#### Port Already in Use
```
Error: Port 3000 is already in use
```

**Solutions:**
1. Kill existing process: `lsof -ti:3000 | xargs kill -9`
2. Use a different port: `sam local start-api --port 3001`
3. Check for other development servers running

#### Docker Issues
```
Error: Unable to find Docker
```

**Solutions:**
1. Make sure Docker Desktop is running
2. Verify Docker is in your PATH: `docker --version`
3. On macOS, restart Docker Desktop

### Debugging Tips

1. **Check Lambda logs** - SAM outputs Lambda execution logs to the terminal
2. **Validate CDK template** - Run `sam validate -t cdk.out/BetterLambdaStack.template.json`
3. **Test individual functions** - Use `sam local invoke FunctionName`
4. **Check function code** - Verify compiled JavaScript in `lambda-functions/*/dist/`

### Development Workflow Tips

1. **Use REST client files for testing** - Open `test-rest-client/users.http` or `test-rest-client/orders.http` in VS Code with REST Client extension
2. **Use dev:local for development** - The SAM template approach (`npm run dev:local`) is more reliable than CDK template approach
3. **Clean builds for troubleshooting** - Run `npm run clean` when things get weird
4. **Test both HTTP methods** - Make sure GET and POST endpoints work
5. **Check CORS settings** - If testing from a browser, ensure CORS is properly configured
6. **Update REST client IDs** - After creating users/orders, copy the returned IDs to test GET endpoints

### Build Order Important!

The CDK synthesis requires Lambda artifacts to exist first. The correct order is:

1. **Build Lambda functions** → `npm run build-lambdas`
2. **Synthesize CDK template** → `npx cdk synth` 
3. **Start SAM local** → `sam local start-api`

Our `npm run dev` command handles this automatically: `npm run sam:build && sam local start-api`

### Quick Reset

If you encounter strange errors, try a complete reset:

```bash
npm run script:clean    # Clean all artifacts
npm run bootstrap       # Reinstall dependencies  
npm run dev             # Build everything and start server
```
