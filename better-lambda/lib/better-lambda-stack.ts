import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
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
        runtime: lambda.Runtime.NODEJS_20_X,
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
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset(
          "deployments/artifacts/order-service-latest.zip"
        ),
        timeout: cdk.Duration.seconds(30),
        memorySize: 512,
      }
    );

    // Create API Gateway
    const api = new apigateway.RestApi(this, "BetterLambdaApi", {
      restApiName: "Better Lambda Service",
      description: "This service serves Lambda functions via API Gateway.",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // Users endpoints
    const users = api.root.addResource("users");
    users.addMethod("POST", new apigateway.LambdaIntegration(userServiceFunction));
    
    const user = users.addResource("{userId}");
    user.addMethod("GET", new apigateway.LambdaIntegration(userServiceFunction));

    // Orders endpoints
    const orders = api.root.addResource("orders");
    orders.addMethod("POST", new apigateway.LambdaIntegration(orderServiceFunction));
    
    const order = orders.addResource("{orderId}");
    order.addMethod("GET", new apigateway.LambdaIntegration(orderServiceFunction));

    // Output the API URL
    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url,
      description: "API Gateway URL",
    });
  }
}
