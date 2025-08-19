# Welcome to your CDK TypeScript project

This is a CDK project that creates a simple "Hello World" AWS Lambda function written in TypeScript.

## Project Structure

- **Source Code**: TypeScript source files are in their respective directories (`lambda/`, `lib/`, `bin/`)
- **Compiled Output**: TypeScript compiles to the `dist/` directory (excluded from git)
- **Lambda Function**: Located in `lambda/hello-world.ts`
- **CDK Stack**: Defined in `lib/cdk-top-level-await-stack.ts`

## Build Process

The project uses a single `tsconfig.json` at the root that compiles all TypeScript files to the `dist/` directory. This keeps the source files clean and separates compiled artifacts.

## Lambda Function

The Lambda function (`lambda/hello-world.js`) returns a JSON response with:

- A "Hello World" message
- Current timestamp
- Request ID (if available)

The function is configured with:

- Node.js 18.x runtime
- 30-second timeout
- Basic execution role with CloudWatch Logs permissions

## Deployment

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build`   compile typescript to js
- `npm run watch`   watch for changes and compile
- `npm run test`    perform the jest unit tests
- `npx cdk deploy`  deploy this stack to your default AWS account/region
- `npx cdk diff`    compare deployed stack with current state
- `npx cdk synth`   emits the synthesized CloudFormation template

## Testing the Lambda Function

After deployment, you can test the Lambda function using:

1. **AWS Console**: Go to Lambda service and test the function directly
2. **AWS CLI**: Use `aws lambda invoke` command
3. **CloudWatch Logs**: Check `/aws/lambda/<function-name>` log group for execution logs

The deployment will output the Lambda function ARN and name for easy reference.
