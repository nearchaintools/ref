/*
  Warnings:

  - The primary key for the `SimplePoolLiquidity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `timestamp` on the `SimplePoolLiquidity` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,0)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "SimplePoolLiquidity" DROP CONSTRAINT "SimplePoolLiquidity_pkey",
ALTER COLUMN "timestamp" SET DATA TYPE BIGINT,
ADD PRIMARY KEY ("timestamp", "poolId", "direction", "accountAddress");
