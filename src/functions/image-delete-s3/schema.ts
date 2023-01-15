import * as Joi from "joi";

import { config } from "../../config";

export const imageDeleteReqQuerySchema = Joi.object({
  url: Joi.string()
    .required()
    .pattern(new RegExp(`^${config.aws.s3.bucketBasePath}`, "i")),
});

export interface imageDeleteReqQuerySchemaType {
  url: string;
}
