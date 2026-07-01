import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validate.middleware";
import {
  deleteProfile,
  deleteProfileImage,
  deleteResume,
  getProfile,
  patchProfile,
  uploadAndParseResume,
  uploadProfileImage,
} from "./profile.controller";
import { modifyProfileSchema } from "./profile.validation";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});

router.use(authMiddleware);

router.get("/view-profile", getProfile);
router.patch(
  "/modify-profile",
  validate({ body: modifyProfileSchema }),
  patchProfile,
);
router.post(
  "/upload-resume",
  upload.single("resume"),
  uploadAndParseResume,
);
router.post(
  "/upload-profile-picture",
  upload.single("profilePic"),
  uploadProfileImage,
);
router.delete("/drop-resume", deleteResume);
router.delete("/drop-profile-picture", deleteProfileImage);
router.delete("/drop-profile", deleteProfile);

export default router;
