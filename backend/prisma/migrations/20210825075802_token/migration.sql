/*
  Warnings:

  - You are about to drop the column `sharesTotalSupply` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the column `totalFee` on the `Pool` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contractId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fee` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supply` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `decimals` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceHash` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spec` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pool" DROP COLUMN "sharesTotalSupply",
DROP COLUMN "totalFee",
ADD COLUMN     "fee" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "supply" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "decimals" INTEGER NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "referenceHash" TEXT NOT NULL,
ADD COLUMN     "spec" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token.contractId_unique" ON "Token"("contractId");
