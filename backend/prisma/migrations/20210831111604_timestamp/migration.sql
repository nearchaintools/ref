/*
  Warnings:

  - The primary key for the `SimplePoolLiquidity` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "SimplePoolLiquidity" DROP CONSTRAINT "SimplePoolLiquidity_pkey",
ALTER COLUMN "timestamp" SET DATA TYPE DECIMAL(65,30),
ADD PRIMARY KEY ("timestamp", "poolId", "direction", "accountAddress");
