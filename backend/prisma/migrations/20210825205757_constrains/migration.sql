/*
  Warnings:

  - The primary key for the `TokenInPool` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pollId` on the `TokenInPool` table. All the data in the column will be lost.
  - Added the required column `poolId` to the `TokenInPool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TokenInPool" DROP CONSTRAINT "TokenInPool_pollId_fkey";

-- DropIndex
DROP INDEX "Pool.tokensArr_unique";

-- AlterTable
ALTER TABLE "TokenInPool" DROP CONSTRAINT "TokenInPool_pkey",
DROP COLUMN "pollId",
ADD COLUMN     "poolId" INTEGER NOT NULL,
ADD PRIMARY KEY ("tokenId", "poolId");

-- AddForeignKey
ALTER TABLE "TokenInPool" ADD FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
