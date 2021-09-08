/*
  Warnings:

  - Added the required column `contractId` to the `TokenInPool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `TokenInPool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenInPool" ADD COLUMN     "contractId" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL;
