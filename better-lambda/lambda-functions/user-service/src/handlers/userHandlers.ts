import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const createUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "{}");

    // Mock user creation logic
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: body.name,
      email: body.email,
      createdAt: new Date().toISOString(),
    };

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "User created successfully",
        user,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" }),
    };
  }
};

export const getUser = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = event.pathParameters?.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "User ID is required" }),
    };
  }

  // Mock user retrieval logic
  const user = {
    id: userId,
    name: "John Doe",
    email: "john.doe@example.com",
    createdAt: "2023-01-01T00:00:00.000Z",
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
  };
};
