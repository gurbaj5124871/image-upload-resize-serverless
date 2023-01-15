import "dotenv/config";
import * as Joi from "joi";

export const config = {
  env: process.env.NODE_ENV,
  deployEnv: process.env.DEPLOY_ENV,

  awsAccessKeyID: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

export type ConfigType = typeof config;

function validateConfig() {
  const schema = Joi.object({
    env: Joi.string().required(),
    deployEnv: Joi.string().required(),
    awsAccessKeyID: Joi.string().required(),
    awsSecretAccessKey: Joi.string().required(),
  });

  Joi.attempt(config, schema);
}

validateConfig();
