import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CdkTopLevelAwaitStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a simple Hello World Lambda function in TypeScript
    const helloWorldLambda = new lambda.Function(this, 'HelloWorldFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'lambda/hello-world.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..')),
      description: 'A TypeScript Hello World Lambda function with AWS SDK',
      timeout: cdk.Duration.seconds(30),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    });

    // Add S3 read permissions to the Lambda function
    helloWorldLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:ListAllMyBuckets',
        's3:GetBucketLocation',
      ],
      resources: ['*'],
    }));

    // Output the Lambda function ARN
    new cdk.CfnOutput(this, 'HelloWorldLambdaArn', {
      value: helloWorldLambda.functionArn,
      description: 'ARN of the Hello World Lambda function',
    });

    // Output the Lambda function name
    new cdk.CfnOutput(this, 'HelloWorldLambdaName', {
      value: helloWorldLambda.functionName,
      description: 'Name of the Hello World Lambda function',
    });
  }
}
