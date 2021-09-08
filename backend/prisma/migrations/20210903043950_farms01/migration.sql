-- CreateEnum
CREATE TYPE "FarmKind" AS ENUM ('SIMPLE_FARM');

-- CreateEnum
CREATE TYPE "FarmStatus" AS ENUM ('CREATED', 'RUNNING', 'ENDED', 'CLEARED');

-- CreateTable
CREATE TABLE "Seed" (
    "id" INTEGER NOT NULL,
    "seedId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nextIndex" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "minDeposit" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" INTEGER NOT NULL,
    "farmId" TEXT NOT NULL,
    "farmKind" "FarmKind" NOT NULL,
    "status" "FarmStatus" NOT NULL,
    "seedId" INTEGER NOT NULL,
    "rewardTokenId" INTEGER NOT NULL,
    "startAt" INTEGER NOT NULL,
    "rewardPerSession" DECIMAL(65,30) NOT NULL,
    "sessionInterval" INTEGER NOT NULL,
    "totalReward" DECIMAL(65,30) NOT NULL,
    "currentRound" INTEGER NOT NULL,
    "lastRound" INTEGER NOT NULL,
    "claimedReward" DECIMAL(65,30) NOT NULL,
    "unclaimedReward" DECIMAL(65,30) NOT NULL,
    "beneficaryReward" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seed.seedId_unique" ON "Seed"("seedId");

-- CreateIndex
CREATE UNIQUE INDEX "Farm.farmId_unique" ON "Farm"("farmId");

-- AddForeignKey
ALTER TABLE "Farm" ADD FOREIGN KEY ("seedId") REFERENCES "Seed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm" ADD FOREIGN KEY ("rewardTokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
