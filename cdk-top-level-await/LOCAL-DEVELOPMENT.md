# Local Lambda Development with CDK

This guide explains how to run your Lambda function locally for development testing **without requiring global installations** or complex setup.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker (optional, for full SAM simulation)

### One-time Setup
```bash
npm run setup
```
This will install dependencies, build the project, and verify everything is working.

## 🛠️ Available Development Commands

### **⚡ Primary Development (Zero Dependencies)**
Fast local testing with our custom runner - **no global tools required**

#### 1. **Test with API Gateway Event**
```bash
npm run local api
```

#### 2. **Test with Empty Event**
```bash
npm run local simple
```

#### 3. **Test with Custom Event**
```bash
npm run local event your-custom-event.json
```

#### 4. **Interactive Help**
```bash
npm run local
```

### **🛠️ AWS SAM CLI Integration**

⚠️  **ES Modules Compatibility Notice**: This project uses ES modules (`"type": "module"`), which have known compatibility issues with SAM CLI's runtime emulator. Your Lambda code works perfectly in actual AWS Lambda.

#### **SAM CLI Command (Educational)**
```bash
npm run sam:lambda
```

This command will:
- Detect the ES modules compatibility issue
- Explain the limitation clearly  
- Attempt to run SAM CLI (expected to fail)
- Guide you to working alternatives

#### **Working Alternatives**

**🚀 Recommended: Fast Node.js Testing**
```bash
npm run local api  # Instant, full functionality
```

**📦 Production Testing**
```bash
npx cdk deploy     # Test in actual AWS Lambda
```

**🔧 SAM CLI Compatibility (Advanced)**
To use SAM CLI, you would need to:
1. Remove `"type": "module"` from `package.json`
2. Update TypeScript config for CommonJS output
3. Rebuild the project

**💡 Our Node.js approach provides equivalent testing capabilities with better ES modules support!**

## 📁 Project Structure

```
├── cdk.out/                           # CDK synthesized CloudFormation templates
│   └── CdkTopLevelAwaitStack.template.json  # Template used by SAM
├── events/                            # Sample events for testing
│   └── api-gateway-event.json        # API Gateway event sample
├── local-env.json                     # Local environment variables
├── lambda/                            # Lambda function source
│   └── hello-world.ts                # Your Lambda handler
└── dist/                             # Compiled TypeScript output
```

## 🔧 Configuration Files

### `local-env.json`
Environment variables for local Lambda execution:
```json
{
  "HelloWorldFunctionB2AB6E79": {
    "AWS_REGION": "us-east-1",
    "NODE_ENV": "development",
    "NODE_OPTIONS": "--enable-source-maps"
  }
}
```

### Custom Events
Create custom test events in the `events/` directory and use them:
```bash
npm run synth && sam local invoke HelloWorldFunctionB2AB6E79 \
  --template-file cdk.out/CdkTopLevelAwaitStack.template.json \
  --env-vars local-env.json \
  --event events/your-custom-event.json
```

## 🧪 Development Workflow

1. **Make code changes** to your Lambda function in `lambda/hello-world.ts`
2. **Run tests** to verify changes: `npm test`
3. **Test locally** instantly: `npm run local api`
4. **Iterate** rapidly with zero deployment time

## 🔄 How It Works

1. **Custom Local Runner**: Our `scripts/local-dev.js` loads your compiled Lambda directly
2. **Automatic AWS Mocks**: Realistic S3 responses without credentials  
3. **Zero Dependencies**: Primary development mode requires only Node.js
4. **Optional Docker/SAM**: For users who need full Lambda runtime simulation
5. **Single Source of Truth**: Your CDK stack defines everything

## 🎯 Benefits

- ✅ **No global installations** - Everything works with just `npm install`
- ✅ **No duplicate templates** - Reuses CDK CloudFormation output when needed
- ✅ **Instant feedback** - Direct Node.js execution for rapid development
- ✅ **Production parity** - Docker option provides full Lambda runtime simulation
- ✅ **Team consistency** - Same experience for all developers
- ✅ **Easy debugging** - Standard Node.js debugging tools work

## 🐛 Troubleshooting

### SAM CLI Issues (Optional)
If `npm run sam:lambda` fails:

**Common Solutions:**
1. **SAM CLI not installed**: Run `brew install aws-sam-cli` (macOS) or download from [AWS releases](https://github.com/aws/aws-sam-cli/releases)
2. **Docker not running**: SAM CLI requires Docker - start Docker Desktop
3. **ES Modules compatibility**: SAM CLI has known issues with ES modules (`"type": "module"` in package.json)
   - This is a limitation of SAM CLI's Lambda runtime emulation
   - Our code works perfectly in actual AWS Lambda, just not in SAM's emulator

**Still having SAM issues?** Use `npm run local api` instead - it's faster, more reliable, and fully compatible with ES modules!

### AWS SDK Integration
The local development environment automatically handles AWS SDK calls:

✅ **Automatic Mocks (Default)**: AWS SDK calls return realistic mock data
- S3 bucket listings show development-like bucket names
- No credentials required
- Consistent, fast responses
- Perfect for rapid development iteration

🔄 **Real AWS Calls (Optional)**: To test against actual AWS services:
```bash
# Configure AWS credentials first
aws configure list
# or use environment variables
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret

# Disable mocks to use real AWS services
AWS_MOCKS_DISABLED=true npm run local api
```

### Template Not Found
If CDK template is missing:
```bash
# Regenerate CDK template
npm run synth
```

### ES Module Import Errors
If you see import resolution errors, ensure `.js` extensions are used in TypeScript imports for relative paths.

## 📚 Additional Resources

- [AWS SAM CLI Reference](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference.html)
- [CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Lambda Local Testing](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-cli-command-reference-sam-local-invoke.html) 