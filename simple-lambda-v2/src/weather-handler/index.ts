import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Extract city from query parameters (GET) or body (POST)
    let city: string | undefined;
    
    if (event.httpMethod === 'GET') {
      city = event.queryStringParameters?.city;
    } else if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      city = body.city;
    }
    
    if (!city) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: 'City parameter is required',
          usage: 'GET /weather?city=London or POST /weather with {"city": "London"}' 
        })
      };
    }
    
    // TODO: Integrate with weather API later
    // For now, return mock data
    const mockWeatherData = {
      city,
      temperature: Math.floor(Math.random() * 30) + 10, // Random temp between 10-40°C
      condition: 'Sunny',
      timestamp: new Date().toISOString()
    };
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: `Weather data for ${city}`,
        data: mockWeatherData
      })
    };
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process weather request'
      })
    };
  }
}; 