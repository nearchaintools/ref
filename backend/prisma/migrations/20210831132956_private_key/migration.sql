/*
  Warnings:

  - The primary key for the `SimplePoolLiquidity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `timestamp` to the `SimplePoolLiquidity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SimplePoolLiquidity" DROP CONSTRAINT "SimplePoolLiquidity_pkey",
ADD COLUMN     "timestamp" DECIMAL(20,0) NOT NULL,
ADD PRIMARY KEY ("timestamp", "dateTime", "poolId", "direction", "accountAddress");
