import * as Joi from "joi";

export function filenameWithExtensionValidator(value: string): string {
  const split = value.split(".");
  if (split.length != 2) {
    throw new Error("Invalid filename");
  }
  if (split[0] === "" || split[1] === "") {
    throw new Error("Invalid filename");
  }

  return value;
}

export const imageRequestPresignedURLReqQuerySchema = Joi.object({
  filename: Joi.string().custom(filenameWithExtensionValidator).required(),
});

export interface imageRequestPresignedURLReqQuerySchemaType {
  filename: string;
}
