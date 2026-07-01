import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional();

const experienceSchema = z.object({
  company: z.string().trim().max(150).default(""),
  designation: z.string().trim().max(150).default(""),
  location: z.string().trim().max(150).default(""),
  startDate: z.string().trim().max(50).default(""),
  endDate: z.string().trim().max(50).default(""),
  description: z.string().trim().max(3000).default(""),
}).strict();

const educationSchema = z.object({
  institution: z.string().trim().max(200).default(""),
  degree: z.string().trim().max(150).default(""),
  fieldOfStudy: z.string().trim().max(150).default(""),
  startDate: z.string().trim().max(50).default(""),
  endDate: z.string().trim().max(50).default(""),
}).strict();

const certificationSchema = z.object({
  title: z.string().trim().max(200).default(""),
  issuer: z.string().trim().max(200).default(""),
  year: z.string().trim().max(50).default(""),
}).strict();

export const modifyProfileSchema = z.object({
  fullName: optionalText(150),
  phoneNumber: optionalText(30),
  address: optionalText(500),
  skills: z.array(z.string().trim().min(1).max(100)).max(100).optional(),
  experience: z.array(experienceSchema).max(100).optional(),
  education: z.array(educationSchema).max(100).optional(),
  certifications: z.array(certificationSchema).max(100).optional(),
  languages: z.array(z.string().trim().min(1).max(100)).max(100).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "At least one profile field is required",
});

export type ModifyProfileInput = z.infer<typeof modifyProfileSchema>;
