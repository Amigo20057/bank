-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PROCESS', 'PROCESSED', 'ERROR');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'WITHDRAWAL', 'TRANSACTION', 'LOAN', 'TRANSFER');

-- CreateTable
CREATE TABLE "transactions" (
    "id" BIGSERIAL NOT NULL,
    "recipient_card_number" TEXT NOT NULL,
    "sender_card_number" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "valuta" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PROCESS',
    "type" "TransactionType" NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);
