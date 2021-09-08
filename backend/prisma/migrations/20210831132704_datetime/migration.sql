/*
  Warnings:

  - The primary key for the `SimplePoolLiquidity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `timestamp` on the `SimplePoolLiquidity` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `SimplePoolLiquidity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SimplePoolLiquidity" DROP CONSTRAINT "SimplePoolLiquidity_pkey",
DROP COLUMN "timestamp",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL,
ADD PRIMARY KEY ("dateTime", "poolId", "direction", "accountAddress");
