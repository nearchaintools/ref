-- CreateEnum
CREATE TYPE "ChainUpdateType" AS ENUM ('ACCOUNT', 'VALIDATOR', 'NOMINATOR');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VALIDATOR', 'NOMINATOR');

-- CreateEnum
CREATE TYPE "PoolKind" AS ENUM ('SIMPLE_POOL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "role" "Role" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chain" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "updateStartedAt" TIMESTAMP(3),
    "lastUpdatedAt" TIMESTAMP(3),
    "lastGrabbedBlock" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChainUpdates" (
    "id" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "type" "ChainUpdateType" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" SERIAL NOT NULL,
    "totalFee" DECIMAL(65,30) NOT NULL,
    "sharesTotalSupply" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenInPool" (
    "tokenId" INTEGER NOT NULL,
    "pollId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,

    PRIMARY KEY ("tokenId","pollId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Chain.name_unique" ON "Chain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ChainUpdates.chainId_type_unique" ON "ChainUpdates"("chainId", "type");

-- AddForeignKey
ALTER TABLE "ChainUpdates" ADD FOREIGN KEY ("chainId") REFERENCES "Chain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenInPool" ADD FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenInPool" ADD FOREIGN KEY ("pollId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
