import S3 from "aws-sdk/clients/s3";
import {
  createPresignedPost,
  PresignedPostOptions,
} from "@aws-sdk/s3-presigned-post";
import { Conditions } from "@aws-sdk/s3-presigned-post/dist-types/types";
import { Readable } from "stream";
import { config } from "../config";

const s3 = new S3({
  params: { Bucket: config.aws.s3.bucketName },
  signatureVersion: "v4",
  region: config.aws.region,
});

const uploadSizeMinMaxRange = {
  min: 1,
  max: 20971520, // 20 MB
};
const presignedUrlValidityInSeconds = 20 * 60;

export const getPresignedURL = async function (path: string) {
  const conditions: Conditions[] = [
    ["starts-with", "$key", `${path}`],
    [
      "content-length-range",
      uploadSizeMinMaxRange.min,
      uploadSizeMinMaxRange.max,
    ],
    ["starts-with", "$Content-Type", "image/"],
  ];

  const params: PresignedPostOptions = {
    Bucket: config.aws.s3.bucketName,
    Key: path,
    Expires: presignedUrlValidityInSeconds,
    Conditions: conditions,
  };

  const url = await createPresignedPost(s3, params);

  return url;
};

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
