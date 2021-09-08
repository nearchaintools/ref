/*
  Warnings:

  - Added the required column `amount` to the `TokenInPoolHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inputVolume` to the `TokenInPoolHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputVolume` to the `TokenInPoolHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenInPoolHistory" ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "inputVolume" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "outputVolume" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "SimplePoolAmountHistory" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tokenInPoolId" INTEGER NOT NULL,
    "poolId" INTEGER NOT NULL,
    "token1Id" INTEGER NOT NULL,
    "token1Amount" DECIMAL(65,30) NOT NULL,
    "token2Id" INTEGER NOT NULL,
    "token2Amount" DECIMAL(65,30) NOT NULL,
    "swap1to2" DECIMAL(65,30) NOT NULL,
    "swap2to1" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("createdAt","poolId")
);

-- AddForeignKey
ALTER TABLE "SimplePoolAmountHistory" ADD FOREIGN KEY ("tokenInPoolId") REFERENCES "TokenInPool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimplePoolAmountHistory" ADD FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
