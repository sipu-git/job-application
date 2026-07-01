import { z } from "zod";
import { EmploymentType, JobStatus } from "../../../generated/prisma/enums";

// Create Job Schema
export const createJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description too short"),
  requirements: z.string().min(5),
  location: z.string().min(2),
  salaryMin: z.coerce.number().nonnegative(),
  salaryMax: z.coerce.number().nonnegative(),
  skills: z.array(z.string()).optional(),
  levelType: z.enum(["FRESHER", "EXPERIENCED"]),
  experience_limit:z.string().optional(),
  experience_desc:z.string().optional(),
  maxExperience: z.coerce.number().nonnegative().optional(),
  employmentType: z.enum(EmploymentType),
  status: z.nativeEnum(JobStatus).optional(),
  atsKeywords: z.array(z.string()).optional(),
  atsMinScore: z.number().min(0).max(100).optional(),
  atsWeights: z.record(z.string(), z.number().min(0).max(100)).refine(
    (weights) => {
      const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
      return Math.abs(total - 100) < 0.01;
    },
    { message: "ATS weights must sum to 100" }
  ).optional()
})
  .refine((data) => data.salaryMin <= data.salaryMax, {
    message: "Minimum salary cannot be greater than maximum salary",
    path: ["salaryMin"],
  });


export const searchJobSchema = z.object({
  keyword: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),

  minSalary: z.coerce.number().optional(),
  maxSalary: z.coerce.number().optional(),

  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export const jobIdSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;