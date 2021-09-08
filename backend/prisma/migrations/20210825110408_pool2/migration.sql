/*
  Warnings:

  - You are about to drop the column `tokenArr` on the `Pool` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokensArr]` on the table `Pool` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Pool.tokenArr_unique";

-- AlterTable
ALTER TABLE "Pool" DROP COLUMN "tokenArr",
ADD COLUMN     "tokensArr" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Pool.tokensArr_unique" ON "Pool"("tokensArr");
