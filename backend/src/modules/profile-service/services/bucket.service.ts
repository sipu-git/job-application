import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../../shared/integrations/configs/s3.config";
import { getObjectKey } from "../utils/bucket.util";
import { AppError } from "../../../shared/lib/AppError";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const ALLOWED_RESUME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

const extensionByMimeType: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const uploadObject = async (
    file: Express.Multer.File,
    userId: string,
    folder: "profiles" | "resumes",
) => {
    const extension = extensionByMimeType[file.mimetype];
    const fileKey = `${folder}/${userId}-${crypto.randomUUID()}.${extension}`;

    await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));

    return fileKey;
};

export const uploadProfilePicture = async (file: Express.Multer.File, userId: string) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        throw new AppError("Only PNG, JPEG, and WebP profile pictures are allowed", 400);
    }
    return uploadObject(file, userId, "profiles");
};


export const uploadResume = async (file: Express.Multer.File, userId: string) => {
    if (!ALLOWED_RESUME_TYPES.includes(file.mimetype)) {
        throw new AppError("Only PDF, DOCX, PNG, JPEG, and WebP resumes are allowed", 400);
    }
    return uploadObject(file, userId, "resumes");
};

export const deleteImageObject = async (storedValue: string | null | undefined) => {
    if (!storedValue) return;

    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: getObjectKey(storedValue),
    });

    await s3.send(command);
};
