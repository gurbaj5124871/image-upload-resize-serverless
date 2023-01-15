import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";

interface AuthTokenDecoded {
  userID: string;
}

type ValidatedAndAuthenticatedAPIGatewayProxyEvent<Body, Params> = Omit<
  APIGatewayProxyEvent,
  "body"
> & {
  body: Body;
} & { authDecoded: AuthTokenDecoded } & { queryStringParameters: Params };
export type ValidatedEventAPIGatewayProxyEvent<Body, Params> = Handler<
  ValidatedAndAuthenticatedAPIGatewayProxyEvent<Body, Params>,
  APIGatewayProxyResult
>;
export type ValidatedEventAPIGatewayProxyEventCallback<Body, Params> = Handler<
  ValidatedAndAuthenticatedAPIGatewayProxyEvent<Body, Params>,
  any
>;

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
