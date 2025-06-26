import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class SimpleLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create Cognito User Pool for authentication
    const userPool = new cognito.UserPool(this, "GreetingApiUserPool", {
      userPoolName: "greeting-api-user-pool",
      signInAliases: {
        email: true,
        username: true,
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For dev/testing
    });

    // Create User Pool Client
    const userPoolClient = new cognito.UserPoolClient(
      this,
      "GreetingApiUserPoolClient",
      {
        userPool,
        userPoolClientName: "greeting-api-client",
        generateSecret: false, // For frontend apps
        authFlows: {
          userPassword: true,
          userSrp: true,
          adminUserPassword: true, // Enable ADMIN_NO_SRP_AUTH flow
        },
      }
    );

    // 2. Create Lambda function for NestJS API
    const greetingLambda = new lambda.Function(this, "GreetingLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Event:', JSON.stringify(event, null, 2));
          
          // Extract user information from Cognito authorizer
          const user = event.requestContext?.authorizer?.claims;
          const userName = user?.['cognito:username'] || user?.sub || 'Anonymous';
          
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type,Authorization',
              'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            body: JSON.stringify({
              message: \`Hello \${userName}! Welcome to the NestJS API on AWS Lambda.\`,
              timestamp: new Date().toISOString(),
              requestId: event.requestContext?.requestId
            })
          };
        };
      `),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        USER_POOL_ID: userPool.userPoolId,
        USER_POOL_CLIENT_ID: userPoolClient.userPoolClientId,
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    // 3. Create API Gateway with Cognito Authorizer
    const api = new apigateway.RestApi(this, "GreetingApi", {
      restApiName: "Greeting API",
      description:
        "API Gateway for greeting service with Cognito authentication",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    // Create Cognito Authorizer
    const cognitoAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      "CognitoAuthorizer",
      {
        cognitoUserPools: [userPool],
        authorizerName: "greeting-api-authorizer",
        identitySource: "method.request.header.Authorization",
      }
    );

    // Create Lambda integration
    const lambdaIntegration = new apigateway.LambdaIntegration(greetingLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });

    // Add /greet GET endpoint with Cognito authentication
    const greetResource = api.root.addResource("greet");
    greetResource.addMethod("GET", lambdaIntegration, {
      authorizer: cognitoAuthorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // Add a public health check endpoint (no auth required)
    const healthResource = api.root.addResource("health");
    healthResource.addMethod("GET", lambdaIntegration);

    // 4. Outputs for easy access
    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: api.url,
      description: "API Gateway endpoint URL",
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
      description: "Cognito User Pool ID",
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
      description: "Cognito User Pool Client ID",
    });

    new cdk.CfnOutput(this, "GreetEndpoint", {
      value: `${api.url}greet`,
      description: "Authenticated greet endpoint",
    });

    new cdk.CfnOutput(this, "HealthEndpoint", {
      value: `${api.url}health`,
      description: "Public health check endpoint",
    });

    new cdk.CfnOutput(this, "CreateTestUserCommand", {
      value: `aws cognito-idp admin-create-user --user-pool-id ${userPool.userPoolId} --username testuser --user-attributes Name=email,Value=test@example.com Name=email_verified,Value=true --temporary-password TempPass123! --message-action SUPPRESS --profile dev`,
      description: "Command to create a test user",
    });

    new cdk.CfnOutput(this, "SetUserPasswordCommand", {
      value: `aws cognito-idp admin-set-user-password --user-pool-id ${userPool.userPoolId} --username testuser --password TestPass123! --permanent --profile dev`,
      description: "Command to set permanent password for test user",
    });

    new cdk.CfnOutput(this, "AuthenticateCommand", {
      value: `aws cognito-idp admin-initiate-auth --user-pool-id ${userPool.userPoolId} --client-id ${userPoolClient.userPoolClientId} --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=testuser,PASSWORD=TestPass123! --profile dev`,
      description: "Command to get authentication token",
    });
  }
}
