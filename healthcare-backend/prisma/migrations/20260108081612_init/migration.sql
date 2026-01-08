/*
  Warnings:

  - The `status` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PatientStatus" AS ENUM ('ADMITTED', 'DISCHARGED');

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "status",
ADD COLUMN     "status" "PatientStatus" NOT NULL DEFAULT 'ADMITTED';

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
