/*
  Warnings:

  - Added the required column `decimals` to the `TokenInPool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenInPool" ADD COLUMN     "decimals" INTEGER NOT NULL;
