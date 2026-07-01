/*
  Warnings:

  - You are about to drop the column `maxExperience` on the `Jobs` table. All the data in the column will be lost.
  - You are about to drop the column `minExperience` on the `Jobs` table. All the data in the column will be lost.
  - Added the required column `levelType` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('FRESHER', 'EXPERIENCED');

-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "maxExperience",
DROP COLUMN "minExperience",
ADD COLUMN     "experience_desc" TEXT,
ADD COLUMN     "experience_limit" TEXT,
ADD COLUMN     "levelType" "ExperienceLevel" NOT NULL;
