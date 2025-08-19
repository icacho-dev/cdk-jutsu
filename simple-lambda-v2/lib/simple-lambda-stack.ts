import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';

export class SimpleLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Weather Lambda Function
    const weatherLambda = new lambda.Function(this, 'WeatherHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src/weather-handler')),
      functionName: 'simple-lambda-weather-handler',
      description: 'Lambda function to handle weather API requests',
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        NODE_ENV: 'production',
      },
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'WeatherApi', {
      restApiName: 'Simple Weather API',
      description: 'API Gateway for weather Lambda function',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // Weather resource and methods
    const weatherResource = api.root.addResource('weather');
    const weatherIntegration = new apigateway.LambdaIntegration(weatherLambda);
    
    weatherResource.addMethod('GET', weatherIntegration);
    weatherResource.addMethod('POST', weatherIntegration);

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Weather API Gateway URL',
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: weatherLambda.functionName,
      description: 'Weather Lambda Function Name',
    });
  }
}
