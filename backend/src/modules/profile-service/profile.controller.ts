import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/lib/AppError";
import {
  dropProfile,
  modifyProfile,
  parseAndSaveResume,
  removeProfilePicture,
  removeResume,
  saveProfilePicture,
  viewProfile,
} from "./services/profile.service";

const userIdFrom = (req: Request) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await viewProfile(userIdFrom(req));
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const patchProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await modifyProfile(userIdFrom(req), req.body);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAndParseResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await parseAndSaveResume(userIdFrom(req), req.file);
    return res.status(200).json({
      success: true,
      message: "Resume parsed and profile auto-filled successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await saveProfilePicture(userIdFrom(req), req.file);
    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await removeResume(userIdFrom(req));
    return res.status(200).json({
      success: true,
      message: "Resume removed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await removeProfilePicture(userIdFrom(req));
    return res.status(200).json({
      success: true,
      message: "Profile picture removed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await dropProfile(userIdFrom(req));
    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};
