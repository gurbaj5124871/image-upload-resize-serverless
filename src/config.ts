import "dotenv/config";
import * as Joi from "joi";

export const config = {
  env: process.env.NODE_ENV,
  deployEnv: process.env.DEPLOY_ENV,

  aws: {
    region: process.env.REGION,
    s3: {
      bucketName: process.env.S3_BUCKET_NAME,
      bucketBasePath: process.env.S3_BUCKET_BASE_PATH, // path to cdn/cloudfront or s3 bucket
    },
  },

  jwt: {
    secretManagerKeyForJWTSecret: process.env.SECRET_MANAGER_KEY_JWT_SECRET,

    options: {
      algorithm: "HS256",
      audience: "image-upload-serverless",
      issuer: "mage-upload-serverless",
      expiresIn: "1d",
    },
  },
};

export type ConfigType = typeof config;

function validateConfig() {
  const schema = Joi.object({
    env: Joi.string().required(),
    deployEnv: Joi.string().required(),

    aws: Joi.object()
      .keys({
        region: Joi.string().required(),
        s3: Joi.object()
          .keys({
            bucketName: Joi.string().required(),
            bucketBasePath: Joi.string().required(),
          })
          .required(),
      })
      .required(),

    jwt: Joi.object()
      .keys({
        secretManagerKeyForJWTSecret: Joi.string().required(),
        options: Joi.object()
          .keys({
            algorithm: Joi.string().required(),
            audience: Joi.string().required(),
            issuer: Joi.string().required(),
          })
          .required(),
      })
      .required(),
  });

  Joi.attempt(config, schema);
}

validateConfig();
