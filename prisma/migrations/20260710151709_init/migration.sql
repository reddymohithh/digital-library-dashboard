-- CreateEnum
CREATE TYPE "Format" AS ENUM ('PHYSICAL', 'AUDIOBOOK', 'EBOOK');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('READING', 'WANT_TO_READ', 'FINISHED', 'DNF', 'ON_HOLD', 'RE_READING');

-- CreateEnum
CREATE TYPE "DailyStatus" AS ENUM ('MET', 'PARTIAL', 'MISSED');

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genre" TEXT,
    "yearPublished" INTEGER,
    "pages" INTEGER,
    "status" "Status" NOT NULL,
    "format" "Format" NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "dateStarted" DATE,
    "dateFinished" DATE,
    "description" TEXT,
    "notes" TEXT,
    "source" TEXT,
    "coverUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "booksGoal" INTEGER NOT NULL,
    "dailyPages" INTEGER NOT NULL,
    "targetGenre" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "date" DATE NOT NULL,
    "status" "DailyStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("date")
);

-- CreateIndex
CREATE INDEX "Book_status_idx" ON "Book"("status");

-- CreateIndex
CREATE INDEX "Book_genre_idx" ON "Book"("genre");

-- CreateIndex
CREATE UNIQUE INDEX "Goal_year_key" ON "Goal"("year");
