import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createUser, getUser } from "./handlers/userHandlers";

// Export individual handlers for SAM template
export { createUser, getUser } from "./handlers/userHandlers";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    const { httpMethod, pathParameters } = event;

    switch (httpMethod) {
      case "POST":
        return await createUser(event);
      case "GET":
        if (pathParameters?.userId) {
          return await getUser(event);
        }
        break;
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ message: "Method not allowed" }),
        };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Not found" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
