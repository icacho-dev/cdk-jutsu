import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from './hello-world.js';

// Create S3 client mock
const s3Mock = mockClient(S3Client);

describe('Lambda Hello World Handler', () => {
  beforeEach(() => {
    s3Mock.reset();
    s3Mock.on(ListBucketsCommand).resolves({
      Buckets: [
        { Name: 'test-bucket-1' },
        { Name: 'test-bucket-2' }
      ]
    });
  });

  const mockContext: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'test-function',
    functionVersion: '1',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
    memoryLimitInMB: '128',
    awsRequestId: 'test-request-id',
    logGroupName: '/aws/lambda/test-function',
    logStreamName: '2023/01/01/[$LATEST]abcdef123456',
    getRemainingTimeInMillis: () => 30000,
    done: vi.fn(),
    fail: vi.fn(),
    succeed: vi.fn()
  };

  const mockEvent: APIGatewayProxyEvent = {
    httpMethod: 'GET',
    path: '/test',
    headers: { 'User-Agent': 'test-agent' },
    multiValueHeaders: {},
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    pathParameters: {},
    stageVariables: {},
    requestContext: {
      requestId: 'test-request-id',
      stage: 'test',
      resourceId: 'test',
      httpMethod: 'GET',
      requestTime: '01/Jan/2023:00:00:00 +0000',
      requestTimeEpoch: 1672531200000,
      path: '/test',
      protocol: 'HTTP/1.1',
      resourcePath: '/test',
      accountId: '123456789012',
      apiId: 'test-api',
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        principalOrgId: null,
        sourceIp: '127.0.0.1',
        user: null,
        userAgent: 'test-agent',
        userArn: null,
        clientCert: null
      },
      authorizer: {}
    },
    resource: '/test',
    body: null,
    isBase64Encoded: false
  };

  it('should return successful response with hello world message', async () => {
    const result = await handler(mockEvent, mockContext);

    expect(result.statusCode).toBe(200);
    expect(result.headers?.['Content-Type']).toBe('application/json');
    
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Hello World from TypeScript Lambda!');
    expect(body.requestId).toBe('test-request-id');
    expect(body.functionName).toBe('test-function');
    expect(body.defaultUser).toEqual({ id: '1', name: 'John Doe' });
    expect(body.awsInfo.s3BucketCount).toBe(2);
    expect(body.awsInfo.s3BucketNames).toEqual(['test-bucket-1', 'test-bucket-2']);
    
    // Verify S3 client was called
    expect(s3Mock.commandCalls(ListBucketsCommand)).toHaveLength(1);
  });
});
