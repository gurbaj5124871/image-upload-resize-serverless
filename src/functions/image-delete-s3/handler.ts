import "source-map-support/register";
import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/apiGateway";
import { restApi } from "@libs/lambda";
import {
  imageDeleteReqQuerySchema,
  imageDeleteReqQuerySchemaType,
} from "./schema";
import { deleteImageFromS3 } from "./services";

const ImageDeleteS3: ValidatedEventAPIGatewayProxyEvent<
  {},
  imageDeleteReqQuerySchemaType
> = async (event) => {
  const { userID } = event.authDecoded;
  const { url } = event.queryStringParameters;

  await deleteImageFromS3({ userID, url });

  return formatJSONResponse({
    message: "Images Deleted successfully",
    data: {},
  });
};

export const main = restApi(ImageDeleteS3, {
  authenticate: {
    isEnabled: true,
  },
  reqQueryParamsSchema: imageDeleteReqQuerySchema,
});
