import "source-map-support/register";
import { nanoid } from "nanoid";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/apiGateway";
import { restApi } from "@libs/lambda";
import { getPresignedURL } from "@libs/s3";
import {
  imageRequestPresignedURLReqQuerySchema,
  imageRequestPresignedURLReqQuerySchemaType,
} from "./schema";

const ImageRequestPresignedURL: ValidatedEventAPIGatewayProxyEvent<
  {},
  imageRequestPresignedURLReqQuerySchemaType
> = async (event) => {
  const { userID } = event.authDecoded;
  const { filename } = event.queryStringParameters;
  const ext = filename.split(".").pop();

  const path = `${userID.split("").reverse().join("")}/${nanoid()}.${ext}`;
  const presignedURL = getPresignedURL(path);

  return formatJSONResponse({
    message: "Image Upload Presigned URL",
    data: {
      presignedURL,
    },
  });
};

export const main = restApi(ImageRequestPresignedURL, {
  authenticate: {
    isEnabled: true,
  },
  reqQueryParamsSchema: imageRequestPresignedURLReqQuerySchema,
});
