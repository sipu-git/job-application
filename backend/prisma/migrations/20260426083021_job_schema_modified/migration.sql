/*
  Warnings:

  - You are about to drop the column `experienceLevel` on the `Jobs` table. All the data in the column will be lost.
  - Added the required column `minExperience` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "experienceLevel",
ADD COLUMN     "maxExperience" DECIMAL(65,30),
ADD COLUMN     "minExperience" DECIMAL(65,30) NOT NULL;
