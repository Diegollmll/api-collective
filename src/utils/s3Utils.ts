import s3Client from "../config/s3Config";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadToS3 = async (
  fileContent: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  const bucketName = process.env.BUCKET_AWS;

  if (!bucketName) {
    throw new Error(
      "The AWS bucket name is not defined in the environment variables."
    );
  }

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    return `https://${bucketName}.s3.${process.env.REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload the file to S3.");
  }
};

export const processFile = async (
  file: File | null,
  folder: string
): Promise<string | null> => {
  if (!file || !(file instanceof File)) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const key = `${folder}/${Date.now()}-${file.name}`;
  const contentType = file.type;

  try {
    const fileUrl = await uploadToS3(buffer, key, contentType);
    return fileUrl;
  } catch (error) {
    console.error(`Error uploading ${folder} to S3:`, error);
    throw new Error(`Error uploading ${folder} to S3.`);
  }
};
