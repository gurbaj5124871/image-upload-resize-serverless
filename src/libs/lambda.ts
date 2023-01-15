import middy from "@middy/core";
import { ObjectSchema as JoiObjectSchema } from "joi";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import helmet from "@middy/http-security-headers";
import secretsManager from "@middy/secrets-manager";
import cors from "@middy/http-cors";
import { jwtAuthMiddleware } from "@middleware/authentication";
import {
  validateReqHeaders,
  validateReqQueryParams,
  validateReqBody,
} from "@middleware/validator";
import { requestPayloadTransformerMiddleware } from "@middleware/reqPayloadTransformer";
import { errorHandler } from "@middleware/errorHandler";
import { config } from "../config";
import logger from "@libs/logger";

const jwtAuthSecretsManagerOptions = {
  cache: true,
  cacheExpiryInMillis: 10800000, // 3 hours
  secrets: {
    JWT_SECRET: config.jwt.secretManagerKeyForJWTSecret,
  },
  throwOnFailedCall: true,
  awsClientOptions: {
    region: config.aws.region,
  },
};

export const restApi = (
  handler,
  {
    authenticate,
    reqHeadersSchema,
    reqQueryParamsSchema,
    reqBodySchema,
    transformReqPayloads,
  }: {
    authenticate: {
      isEnabled: Boolean;
    };
    reqHeadersSchema?: JoiObjectSchema<any>;
    reqQueryParamsSchema?: JoiObjectSchema<any>;
    reqBodySchema?: JoiObjectSchema<any>;
    transformReqPayloads?: {
      payloadType: "body" | "headers" | "queryStringParameters";
      transformerFunction: Function;
    }[];
  }
) => {
  const middleware = [helmet()];

  if (authenticate.isEnabled) {
    middleware.push(
      secretsManager(jwtAuthSecretsManagerOptions),
      jwtAuthMiddleware()
    );
  }
  if (reqHeadersSchema) {
    middleware.push(validateReqHeaders(reqHeadersSchema));
  }
  if (reqQueryParamsSchema) {
    const queryParamsNormalizerMiddleware = () => {
      return {
        before: ({ event }) => {
          if ([null, undefined].includes(event.queryStringParameters)) {
            event.queryStringParameters = {};
          }
        },
      };
    };
    middleware.push(
      queryParamsNormalizerMiddleware(),
      validateReqQueryParams(reqQueryParamsSchema)
    );
  }
  if (reqBodySchema) {
    middleware.push(middyJsonBodyParser(), validateReqBody(reqBodySchema));
  }

  // Transformer middleware are executed after validators
  if (transformReqPayloads && transformReqPayloads.length) {
    transformReqPayloads.forEach((t) =>
      middleware.push(requestPayloadTransformerMiddleware(t))
    );
  }

  // Push error handler middleware in last
  middleware.push(
    cors(),
    errorHandler({
      logger: logger.error,
    })
  );

  return middy(handler).use(middleware);
};
