import { prisma } from "../../../shared/lib/prisma";
import { AppError } from "../../../shared/lib/AppError";
import type { ModifyProfileInput } from "../profile.validation";
import { extractText } from "../utils/extractData.util";
import { generateImageUrl } from "../utils/bucket.util";
import { parseBYGenAi } from "./parsing.service";
import {
  deleteImageObject,
  uploadProfilePicture,
  uploadResume,
} from "./bucket.service";

const emptyProfileData = (userId: string) => ({
  userId,
  fullName: "",
  phoneNumber: "",
  address: "",
  profilePic: null,
  resume: null,
  fileUrl: "",
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  languages: [],
});

const findUser = async (userId: string) => {
  const user = await prisma.auth.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) throw new AppError("User not found", 404);
  return user;
};

const findProfile = (userId: string) =>
  prisma.profile.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

const signedUrl = async (value: string | null | undefined) => {
  if (!value) return null;
  return generateImageUrl(value);
};

const presentProfile = async (
  user: { id: string; email: string },
  profile: Awaited<ReturnType<typeof findProfile>>,
) => {
  if (!profile) {
    return {
      id: null,
      ...emptyProfileData(user.id),
      email: user.email,
      isProfileCreated: false,
      createdAt: null,
      updatedAt: null,
    };
  }

  const [profilePicUrl, resumeUrl] = await Promise.all([
    signedUrl(profile.profilePic),
    signedUrl(profile.resume || profile.fileUrl),
  ]);

  return {
    ...profile,
    email: user.email,
    profilePic: profilePicUrl,
    resume: resumeUrl,
    fileUrl: resumeUrl || "",
    isProfileCreated: true,
  };
};

const safelyDeleteObject = async (value: string | null | undefined) => {
  if (!value) return;
  try {
    await deleteImageObject(value);
  } catch (error) {
    console.error("Unable to delete old profile object from S3:", error);
  }
};

export const viewProfile = async (userId: string) => {
  const [user, profile] = await Promise.all([
    findUser(userId),
    findProfile(userId),
  ]);
  return presentProfile(user, profile);
};

export const modifyProfile = async (
  userId: string,
  input: ModifyProfileInput,
) => {
  const user = await findUser(userId);
  const current = await findProfile(userId);

  const profile = current
    ? await prisma.profile.update({
        where: { id: current.id },
        data: input as any,
      })
    : await prisma.profile.create({
        data: { ...emptyProfileData(userId), ...input } as any,
      });

  return presentProfile(user, profile);
};

export const parseAndSaveResume = async (
  userId: string,
  file: Express.Multer.File | undefined,
) => {
  if (!file) throw new AppError("Resume file is required", 400);

  const user = await findUser(userId);
  const current = await findProfile(userId);

  let rawText: string;
  try {
    rawText = await extractText(file.buffer, file.originalname);
  } catch {
    throw new AppError(
      "Unsupported resume. Upload a PDF, DOCX, PNG, JPEG, or WebP file",
      400,
    );
  }

  if (!rawText.trim()) {
    throw new AppError("No readable text was found in the resume", 400);
  }

  const parsed = await parseBYGenAi(rawText);
  const newResumeKey = await uploadResume(file, userId);

  try {
    const data = {
      fullName: parsed.fullName,
      phoneNumber: parsed.phoneNumber,
      address: parsed.address,
      skills: parsed.skills,
      experience: parsed.experience,
      education: parsed.education,
      certifications: parsed.certifications,
      languages: parsed.languages,
      resume: newResumeKey,
      fileUrl: newResumeKey,
    };

    const profile = current
      ? await prisma.profile.update({
          where: { id: current.id },
          data: data as any,
        })
      : await prisma.profile.create({
          data: { ...emptyProfileData(userId), ...data } as any,
        });

    await safelyDeleteObject(current?.resume || current?.fileUrl);

    return {
      profile: await presentProfile(user, profile),
      parsedEmail: parsed.email || null,
    };
  } catch (error) {
    await safelyDeleteObject(newResumeKey);
    throw error;
  }
};

export const saveProfilePicture = async (
  userId: string,
  file: Express.Multer.File | undefined,
) => {
  if (!file) throw new AppError("Profile picture is required", 400);

  const user = await findUser(userId);
  const current = await findProfile(userId);
  const newPictureKey = await uploadProfilePicture(file, userId);

  try {
    const profile = current
      ? await prisma.profile.update({
          where: { id: current.id },
          data: { profilePic: newPictureKey },
        })
      : await prisma.profile.create({
          data: {
            ...emptyProfileData(userId),
            profilePic: newPictureKey,
          } as any,
        });

    await safelyDeleteObject(current?.profilePic);
    return presentProfile(user, profile);
  } catch (error) {
    await safelyDeleteObject(newPictureKey);
    throw error;
  }
};

export const removeResume = async (userId: string) => {
  const user = await findUser(userId);
  const current = await findProfile(userId);
  if (!current) throw new AppError("Profile not found", 404);

  await safelyDeleteObject(current.resume || current.fileUrl);
  const profile = await prisma.profile.update({
    where: { id: current.id },
    data: { resume: null, fileUrl: "" },
  });

  return presentProfile(user, profile);
};

export const removeProfilePicture = async (userId: string) => {
  const user = await findUser(userId);
  const current = await findProfile(userId);
  if (!current) throw new AppError("Profile not found", 404);

  await safelyDeleteObject(current.profilePic);
  const profile = await prisma.profile.update({
    where: { id: current.id },
    data: { profilePic: null },
  });

  return presentProfile(user, profile);
};

export const dropProfile = async (userId: string) => {
  await findUser(userId);
  const profiles = await prisma.profile.findMany({ where: { userId } });

  await Promise.all(
    profiles.flatMap((profile) => [
      safelyDeleteObject(profile.profilePic),
      safelyDeleteObject(profile.resume || profile.fileUrl),
    ]),
  );
  await prisma.profile.deleteMany({ where: { userId } });
  await prisma.auth.delete({ where: { id: userId } });
  return { deleted: true };
};
