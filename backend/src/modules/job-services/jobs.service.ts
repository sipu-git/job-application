import { Prisma } from "../../../generated/prisma/client";
import { JobStatus } from "../../../generated/prisma/enums";
import { getIO } from "../../shared/integrations/configs/socket.config";
import { AppError } from "../../shared/lib/AppError";
import { prisma } from "../../shared/lib/prisma";
import { CreateJobInput } from "./job.validation";

export const addJob = async (recruiterId: string, data: CreateJobInput) => {

  const job = await prisma.jobs.create({
    data: {
      recruiterId,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      location: data.location,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      skills: data.skills ?? [],
      levelType: data.levelType,
      experience_limit: data.experience_limit ?? null,
      experience_desc: data.experience_desc ?? null,
      employmentType: data.employmentType,
      status: data.status ?? JobStatus.OPEN,
      atsKeywords: data.atsKeywords ?? [],
      atsMinScore: data.atsMinScore,
      atsWeights: data.atsWeights,
    },
  });

  const io = getIO();
  io.emit("job-posted", job);

  return job;
};
export const viewJobs = async () => {
  const jobs = await prisma.jobs.findMany({
    where: {
      status: JobStatus.OPEN
    },
    orderBy: {
      createdAt: "asc"
    },
    include: {
      recruiter: {
        select: {
          id: true,
          fullName: true,
        }
      }
    }
  })
  return jobs;
}

export const viewJob = async (jobId: string) => {
  const findJob = await prisma.jobs.findUnique({
    where: { id: jobId }
  })
  if (!findJob) {
    throw new AppError("job doesn't exist!", 404)
  }
  return findJob;
}

export const searchJob = async (query: {
  keyword?: string;
  location?: string;
  employmentType?: string;
  minSalary?: number;
  maxSalary?: number;
  page?: number;
  limit?: number;
}) => {
  const { keyword, location, employmentType, minSalary, maxSalary, page = 1, limit = 10 } = query;

  const skip = (page - 1) * limit;

  const whereConditions: Prisma.JobsWhereInput = {
    status: JobStatus.OPEN,
    ...(keyword && {
      OR: [
        { title: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
        { requirements: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
      ],
    }),
    ...(location && { location: { contains: location, mode: Prisma.QueryMode.insensitive } }),
    ...(minSalary && { salaryMin: { gte: Number(minSalary) } }),
    ...(employmentType && { employmentType: employmentType as any }),
    ...(maxSalary && { salaryMax: { lte: Number(maxSalary) } }),
  };

  const [searchJobs, total] = await Promise.all([
    prisma.jobs.findMany({
      where: whereConditions,
      include: {
        recruiter: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      skip,
      take: limit,
    }),
    prisma.jobs.count({ where: whereConditions }),
  ]);

  return {
    total,
    page,
    limit,
    searchJobs,
  };
};