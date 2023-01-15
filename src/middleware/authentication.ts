import * as jwt from "jsonwebtoken";
import * as SecretsManager from "aws-sdk/clients/secretsmanager";
import createHttpError from "http-errors";
import { config } from "../config";

const secretManager = new SecretsManager({ region: config.aws.region });

export const jwtAuthMiddleware = () => {
  return {
    before: (request) => {
      const { event, context } = request;

      const secret = context["JWT_SECRET"];
      const tokenHeader: string | undefined = event.headers["Authorization"];
      if (!tokenHeader) {
        throw new createHttpError.Unauthorized("Not Authorized");
      }

      const tokenSplit = tokenHeader.split(" ");
      if (tokenSplit.length !== 2 && tokenSplit[0].toLowerCase() !== "bearer") {
        throw new createHttpError.Unauthorized("Not Authorized");
      }

      const authToken = tokenSplit[1];
      try {
        const decoded = jwt.verify(authToken, secret, config.jwt.options);
        event["authDecoded"] = decoded;
      } catch (err) {
        throw new createHttpError.Unauthorized("Not Authorized");
      }
    },
  };
};

async function getJwtSecret() {
  const secret = await secretManager
    .getSecretValue({ SecretId: config.jwt.secretManagerKeyForJWTSecret })
    .promise();

  if (secret && secret.SecretString) {
    return secret.SecretString;
  } else if (secret && secret.SecretBinary) {
    const buff = Buffer.from(secret.SecretBinary as Buffer);
    const decodedBinarySecret = buff.toString("ascii");
    return decodedBinarySecret;
  }

  throw new Error("Empty secret");
}

// To be used only for api tests
export async function generateJwtToken(payload: { agent_id: string }) {
  const secret = await getJwtSecret();
  return jwt.sign(payload, secret, config.jwt.options);
}
