import createHttpError from "http-errors";
import { deleteObjectsS3 } from "@libs/s3";
import { imageTypesSizes } from "../../constants";
import { config } from "../../config";

export const deleteImageFromS3 = async ({
  userID,
  url,
}: {
  userID: string;
  url: string;
}) => {
  const imageKey = url.replace(config.aws.s3.bucketBasePath, "");
  const [userIDinRev, imageNameWithExt] = imageKey.split("/");

  if (userID !== userIDinRev.split("").reverse().join("")) {
    throw new createHttpError.Unauthorized(
      "You are not authorized to delete the image"
    );
  }

  const [imageName, extension] = imageNameWithExt.split(".");
  const otherSizes = imageTypesSizes;
  const otherSizeKeys = otherSizes
    .filter((size) => size !== "original")
    .map((size) => `${imageName}.${size}.${extension}`);

  await deleteObjectsS3([imageNameWithExt, ...otherSizeKeys]);
};
