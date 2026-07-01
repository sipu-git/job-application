/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `parsed_resumes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "parsed_resumes" DROP CONSTRAINT "parsed_resumes_userId_fkey";

-- DropIndex
DROP INDEX "content_feeds_type_idx";

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "experienceLevel" TEXT,
ADD COLUMN     "skills" JSONB,
ALTER COLUMN "atsKeywords" DROP NOT NULL,
ALTER COLUMN "atsMinScore" DROP NOT NULL,
ALTER COLUMN "atsWeights" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarUrl",
DROP COLUMN "firstName",
DROP COLUMN "isVerified",
DROP COLUMN "lastName",
DROP COLUMN "phone";

-- DropTable
DROP TABLE "parsed_resumes";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "skills" JSONB,
    "experience" JSONB,
    "education" JSONB,
    "certifications" JSONB,
    "languages" JSONB,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
