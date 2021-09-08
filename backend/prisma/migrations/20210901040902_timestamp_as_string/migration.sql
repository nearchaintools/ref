/*
  Warnings:

  - The primary key for the `SimplePoolLiquidity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dateTime` on the `SimplePoolLiquidity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SimplePoolLiquidity" DROP CONSTRAINT "SimplePoolLiquidity_pkey",
DROP COLUMN "dateTime",
ALTER COLUMN "timestamp" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("timestamp", "poolId", "direction", "accountAddress");
