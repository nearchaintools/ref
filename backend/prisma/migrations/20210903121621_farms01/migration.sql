/*
  Warnings:

  - A unique constraint covering the columns `[simplePoolId]` on the table `Farm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `simplePoolId` to the `Farm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Farm" ADD COLUMN     "simplePoolId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pool" ADD COLUMN     "tvl" DECIMAL(65,30);

-- CreateIndex
CREATE UNIQUE INDEX "Farm_simplePoolId_unique" ON "Farm"("simplePoolId");

-- AddForeignKey
ALTER TABLE "Farm" ADD FOREIGN KEY ("simplePoolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
