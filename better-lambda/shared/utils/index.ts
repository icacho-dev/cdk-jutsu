import { APIGatewayProxyResult } from "aws-lambda";

export const createSuccessResponse = (
  data: any,
  statusCode: number = 200
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
  },
  body: JSON.stringify(data),
});

export const createErrorResponse = (
  message: string,
  statusCode: number = 500
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify({ error: message }),
});

export const validateRequestBody = (body: string | null): any => {
  if (!body) {
    throw new Error("Request body is required");
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error("Invalid JSON in request body");
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
