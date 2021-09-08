/*
  Warnings:

  - Added the required column `inputVolume` to the `TokenInPool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputVolume` to the `TokenInPool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenInPool" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "inputVolume" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "outputVolume" DECIMAL(65,30) NOT NULL;
