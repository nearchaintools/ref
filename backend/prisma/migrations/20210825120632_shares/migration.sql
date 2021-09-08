/*
  Warnings:

  - You are about to drop the column `supply` on the `Pool` table. All the data in the column will be lost.
  - Added the required column `totalShares` to the `Pool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pool" DROP COLUMN "supply",
ADD COLUMN     "totalShares" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Pool_id_seq";
