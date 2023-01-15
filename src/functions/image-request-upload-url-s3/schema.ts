import * as Joi from "joi";

export const imageRequestPresignedURLReqQuerySchema = Joi.object({
  filename: Joi.string().required(),
});

export interface imageRequestPresignedURLReqQuerySchemaType {
  filename: string;
}
