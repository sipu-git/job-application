import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3 } from "../../../shared/integrations/configs/s3.config"

export const getObjectKey = (storedValue: string) => {
    if (!storedValue.startsWith("http://") && !storedValue.startsWith("https://")) {
        return storedValue;
    }

    const url = new URL(storedValue);
    const parts = decodeURIComponent(url.pathname).replace(/^\/+/, "").split("/");

    // Path-style S3 URLs contain the bucket as the first path segment.
    if (parts[0] === process.env.AWS_BUCKET_NAME) {
        parts.shift();
    }

    return parts.join("/");
}

export const generateImageUrl = async (storedValue: string) => {
    const fileKey = getObjectKey(storedValue);
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey
    })
    return await getSignedUrl(s3, command, {
        expiresIn: 60 * 60 // Keep persisted data independent of expiring URLs.
    })
}
