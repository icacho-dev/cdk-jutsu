import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BetterLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Example: Pre-built deployment package approach
    // Assumes artifacts are built by CI/CD and placed in deployments/artifacts/
    const userServiceFunction = new lambda.Function(
      this,
      "UserServiceFunction",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          "deployments/artifacts/user-service-latest.zip"
        ),
        timeout: cdk.Duration.seconds(30),
        memorySize: 512,
        environment: {
          NODE_ENV: "production",
        },
      }
    );

    // Alternative: Reference specific version
    const orderServiceFunction = new lambda.Function(
      this,
      "OrderServiceFunction",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          "deployments/artifacts/order-service-latest.zip"
        ),
        timeout: cdk.Duration.seconds(30),
        memorySize: 512,
      }
    );

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'BetterLambdaQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
