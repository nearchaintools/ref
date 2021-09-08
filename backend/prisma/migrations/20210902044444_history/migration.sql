/*
  Warnings:

  - The primary key for the `TokenInPool` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[tokenId,poolId]` on the table `TokenInPool` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TokenInPool" DROP CONSTRAINT "TokenInPool_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "TokenInPoolHistory" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tokenInPoolId" INTEGER NOT NULL,

    PRIMARY KEY ("createdAt","tokenInPoolId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenInPool.tokenId_poolId_unique" ON "TokenInPool"("tokenId", "poolId");

-- AddForeignKey
ALTER TABLE "TokenInPoolHistory" ADD FOREIGN KEY ("tokenInPoolId") REFERENCES "TokenInPool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
