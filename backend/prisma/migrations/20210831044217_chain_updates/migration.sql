/*
  Warnings:

  - The values [ACCOUNT,VALIDATOR,NOMINATOR] on the enum `ChainUpdateType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Chain` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Chain` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdatedAt` on the `Chain` table. All the data in the column will be lost.
  - You are about to drop the column `updateStartedAt` on the `Chain` table. All the data in the column will be lost.
  - The primary key for the `ChainUpdates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chainId` on the `ChainUpdates` table. All the data in the column will be lost.
  - The `id` column on the `ChainUpdates` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[chainName,type]` on the table `ChainUpdates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chainName` to the `ChainUpdates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChainUpdateType_new" AS ENUM ('LIQUIDITY');
ALTER TABLE "ChainUpdates" ALTER COLUMN "type" TYPE "ChainUpdateType_new" USING ("type"::text::"ChainUpdateType_new");
ALTER TYPE "ChainUpdateType" RENAME TO "ChainUpdateType_old";
ALTER TYPE "ChainUpdateType_new" RENAME TO "ChainUpdateType";
DROP TYPE "ChainUpdateType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ChainUpdates" DROP CONSTRAINT "ChainUpdates_chainId_fkey";

-- DropIndex
DROP INDEX "Chain.name_unique";

-- DropIndex
DROP INDEX "ChainUpdates.chainId_type_unique";

-- AlterTable
ALTER TABLE "Chain" DROP CONSTRAINT "Chain_pkey",
DROP COLUMN "id",
DROP COLUMN "lastUpdatedAt",
DROP COLUMN "updateStartedAt",
ADD PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "ChainUpdates" DROP CONSTRAINT "ChainUpdates_pkey",
DROP COLUMN "chainId",
ADD COLUMN     "chainName" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChainUpdates.chainName_type_unique" ON "ChainUpdates"("chainName", "type");

-- AddForeignKey
ALTER TABLE "ChainUpdates" ADD FOREIGN KEY ("chainName") REFERENCES "Chain"("name") ON DELETE CASCADE ON UPDATE CASCADE;
