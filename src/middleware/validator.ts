import * as Joi from "joi";
import createHttpError from "http-errors";

const validatorMiddleware = (opts: {
  schema: Joi.ObjectSchema<any>;
  validate: "body" | "headers" | "queryStringParameters";
}) => {
  return {
    before: ({ event }) => {
      const objectToValidate = ((validate) => {
        switch (validate) {
          case "body":
            return event.body;
          case "headers":
            return event.headers;
          case "queryStringParameters":
            return event.queryStringParameters;
        }
      })(opts.validate);

      try {
        event[opts.validate] = Joi.attempt(objectToValidate, opts.schema);
      } catch (error) {
        throw new createHttpError.BadRequest(
          `For path ${opts.validate}: ${error.name}: ${error.message}`
        );
      }
    },
  };
};

export const validateReqHeaders = (schema: Joi.ObjectSchema<any>) => {
  return validatorMiddleware({ schema, validate: "headers" });
};
export const validateReqBody = (schema: Joi.ObjectSchema<any>) => {
  return validatorMiddleware({ schema, validate: "body" });
};

export const validateReqQueryParams = (schema: Joi.ObjectSchema<any>) => {
  return validatorMiddleware({ schema, validate: "queryStringParameters" });
};
