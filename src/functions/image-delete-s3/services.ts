import { deleteObjectsS3 } from "@libs/s3";
import { imageTypesSizes } from "../../constants";
import { config } from "../../config";

export const deleteImageFromS3 = async ({ url }: { url: string }) => {
  const imageNameWithExt = url.replace(config.aws.s3.bucketBasePath, "");

  const [imageName, extension] = imageNameWithExt.split(".");
  const otherSizes = imageTypesSizes;
  const otherSizeKeys = otherSizes
    .filter((size) => size !== "original")
    .map((size) => `${imageName}.${size}.${extension}`);

  await deleteObjectsS3([imageNameWithExt, ...otherSizeKeys]);
};
