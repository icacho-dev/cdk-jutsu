import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { logger } from '../service/logger-service/logger-service.js';
import { UserService } from '../service/user-service/user-service.js';

// Initialize the S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

// Initialize UserService and create a promise for the default user (top-level await equivalent)
const userService = new UserService();
const defaultUserPromise = userService.getUserById('1');

logger.info('UserService initialized with top-level async operation');

export const handler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    logger.info('Lambda invoked', { 
        event: JSON.stringify(event, null, 2), 
        context: JSON.stringify(context, null, 2) 
    });

    try {
        // Await the default user (demonstrating async initialization)
        const defaultUser = await defaultUserPromise;
        
        // Example AWS SDK usage - list S3 buckets
        const listBucketsCommand = new ListBucketsCommand({});
        const s3Response = await s3Client.send(listBucketsCommand);
        
        const bucketCount = s3Response.Buckets?.length || 0;
        const bucketNames = s3Response.Buckets?.map(bucket => bucket.Name) || [];

        const response: APIGatewayProxyResult = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Enable CORS
            },
            body: JSON.stringify({
                message: 'Hello World from TypeScript Lambda!',
                timestamp: new Date().toISOString(),
                requestId: context.awsRequestId,
                functionName: context.functionName,
                functionVersion: context.functionVersion,
                remainingTimeInMillis: context.getRemainingTimeInMillis(),
                defaultUser: defaultUser,
                awsInfo: {
                    region: process.env.AWS_REGION,
                    s3BucketCount: bucketCount,
                    s3BucketNames: bucketNames.slice(0, 5), // Show first 5 buckets only
                },
                eventInfo: {
                    httpMethod: event.httpMethod || 'N/A',
                    path: event.path || 'N/A',
                    userAgent: event.headers?.['User-Agent'] || 'N/A',
                }
            }),
        };

        logger.info('Lambda response', { response: JSON.stringify(response, null, 2) });

        return response;

    } catch (error) {
        logger.error('Lambda error', { error: error instanceof Error ? error.message : error });
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
                requestId: context.awsRequestId,
            }),
        };
    }
};
