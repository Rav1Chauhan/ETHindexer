-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "binanceUsers" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "depositAddress" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "balance" TEXT NOT NULL,

    CONSTRAINT "binanceUsers_pkey" PRIMARY KEY ("id")
);

