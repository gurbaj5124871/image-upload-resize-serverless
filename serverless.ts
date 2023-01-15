import type { AWS } from "@serverless/typescript";

import { imageRequestPresignedURL, imageDelete } from "./src/functions";

const serverlessConfiguration: AWS = {
  service: "annabelle",
  frameworkVersion: "2",
  configValidationMode: "error",
  custom: {
    defaultNodeEnv: "production",
    defaultDeployEnv: "develop",
    defaultRegion: "us-east-1",
  },
  plugins: ["serverless-offline", "serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "${opt:region, self:custom.defaultRegion}" as "us-east-1",
    stage: "${opt:stage, self:custom.defaultDeployEnv}",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["secretsmanager:GetSecretValue"],
        Resource: ["*"],
      },
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: ["*"],
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      REGION: "${opt:region, self:custom.defaultRegion}",
      DEPLOY_ENV: "${opt:stage, self:custom.defaultDeployEnv}",
      NODE_ENV: "${opt:node-env, self:custom.defaultNodeEnv}",
    },
    versionFunctions: false,
    timeout: 29,
  },
  package: {
    individually: true,
    exclude: ["node_modules/**", "__tests__/**"],
  },
  functions: {
    imageRequestPresignedURL,
    imageDelete,
  },
};

module.exports = serverlessConfiguration;
