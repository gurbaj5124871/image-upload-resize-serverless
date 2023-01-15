import S3 from "aws-sdk/clients/s3";
import { Readable } from "stream";
import { config } from "../config";

const s3 = new S3({
  params: { Bucket: config.aws.s3.bucketName },
  signatureVersion: "v4",
  region: config.aws.region,
});

export const uploadToS3 = function (
  upload: {
    name: string;
    body: Readable | Buffer;
  },
  contentType: string
) {
  return s3
    .upload({
      Bucket: config.aws.s3.bucketName,
      Key: upload.name,
      Body: upload.body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000",
    })
    .promise();
};

export const deleteObjectsS3 = function (keys: string[]) {
  return s3
    .deleteObjects({
      Bucket: config.aws.s3.bucketName as string,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: true,
      },
    })
    .promise();
};
