-- CreateEnum
CREATE TYPE "LiquidityDirection" AS ENUM ('POOL_IN', 'POOL_OUT');

-- CreateTable
CREATE TABLE "SimplePoolLiquidity" (
    "timestamp" INTEGER NOT NULL,
    "poolId" INTEGER NOT NULL,
    "direction" "LiquidityDirection" NOT NULL,
    "accountAddress" TEXT NOT NULL,
    "token1Amount" DECIMAL(65,30) NOT NULL,
    "token2Amount" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("timestamp","poolId","direction","accountAddress")
);

-- AddForeignKey
ALTER TABLE "SimplePoolLiquidity" ADD FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
