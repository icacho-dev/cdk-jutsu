#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { SimpleLambdaStack } from "../lib/simple-lambda-stack";

const app = new cdk.App();
new SimpleLambdaStack(app, "SimpleLambdaStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
