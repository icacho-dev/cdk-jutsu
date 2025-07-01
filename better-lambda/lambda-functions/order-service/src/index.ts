import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    const { httpMethod, pathParameters } = event;

    switch (httpMethod) {
      case "POST":
        return await createOrder(event);
      case "GET":
        if (pathParameters?.orderId) {
          return await getOrder(event);
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

const createOrder = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "{}");

    const order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: body.userId,
      items: body.items,
      total: body.total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Order created successfully",
        order,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" }),
    };
  }
};

const getOrder = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const orderId = event.pathParameters?.orderId;

  if (!orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Order ID is required" }),
    };
  }

  const order = {
    id: orderId,
    userId: "user123",
    items: [{ name: "Product A", quantity: 2, price: 29.99 }],
    total: 59.98,
    status: "completed",
    createdAt: "2023-01-01T00:00:00.000Z",
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ order }),
  };
};
