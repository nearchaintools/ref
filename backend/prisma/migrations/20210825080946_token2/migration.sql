/*
  Warnings:

  - Added the required column `name` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "reference" DROP NOT NULL,
ALTER COLUMN "referenceHash" DROP NOT NULL,
ALTER COLUMN "spec" DROP NOT NULL;
