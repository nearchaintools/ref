/*
  Warnings:

  - A unique constraint covering the columns `[tokenArr]` on the table `Pool` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pool" ADD COLUMN     "tokenArr" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Pool.tokenArr_unique" ON "Pool"("tokenArr");
