/*
  Warnings:

  - The primary key for the `availability_exceptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `availability_exceptions` table. All the data in the column will be lost.
  - The primary key for the `availability_rules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `availability_rules` table. All the data in the column will be lost.
  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hostId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bookings` table. All the data in the column will be lost.
  - The primary key for the `event_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hostId` on the `event_types` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `event_types` table. All the data in the column will be lost.
  - The primary key for the `slots` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hostId` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `slots` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,slug]` on the table `event_types` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `event_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `slots` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "availability_exceptions" DROP CONSTRAINT "availability_exceptions_userId_fkey";

-- DropForeignKey
ALTER TABLE "availability_rules" DROP CONSTRAINT "availability_rules_userId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_hostId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_slotId_fkey";

-- DropForeignKey
ALTER TABLE "event_types" DROP CONSTRAINT "event_types_hostId_fkey";

-- DropForeignKey
ALTER TABLE "slots" DROP CONSTRAINT "slots_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "slots" DROP CONSTRAINT "slots_hostId_fkey";

-- DropIndex
DROP INDEX "bookings_hostId_createdAt_idx";

-- DropIndex
DROP INDEX "event_types_hostId_slug_key";

-- DropIndex
DROP INDEX "slots_hostId_startAt_idx";

-- AlterTable
ALTER TABLE "availability_exceptions" DROP CONSTRAINT "availability_exceptions_pkey",
DROP COLUMN "id",
ADD COLUMN     "exceptionId" SERIAL NOT NULL,
ADD CONSTRAINT "availability_exceptions_pkey" PRIMARY KEY ("exceptionId");

-- AlterTable
ALTER TABLE "availability_rules" DROP CONSTRAINT "availability_rules_pkey",
DROP COLUMN "id",
ADD COLUMN     "ruleId" SERIAL NOT NULL,
ADD CONSTRAINT "availability_rules_pkey" PRIMARY KEY ("ruleId");

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_pkey",
DROP COLUMN "hostId",
DROP COLUMN "id",
ADD COLUMN     "bookingId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("bookingId");

-- AlterTable
ALTER TABLE "event_types" DROP CONSTRAINT "event_types_pkey",
DROP COLUMN "hostId",
DROP COLUMN "id",
ADD COLUMN     "eventTypeId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "event_types_pkey" PRIMARY KEY ("eventTypeId");

-- AlterTable
ALTER TABLE "slots" DROP CONSTRAINT "slots_pkey",
DROP COLUMN "hostId",
DROP COLUMN "id",
ADD COLUMN     "slotId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "slots_pkey" PRIMARY KEY ("slotId");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userId");

-- CreateIndex
CREATE INDEX "bookings_userId_createdAt_idx" ON "bookings"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "event_types_userId_slug_key" ON "event_types"("userId", "slug");

-- CreateIndex
CREATE INDEX "slots_userId_startAt_idx" ON "slots"("userId", "startAt");

-- AddForeignKey
ALTER TABLE "event_types" ADD CONSTRAINT "event_types_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("eventTypeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "event_types"("eventTypeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "slots"("slotId") ON DELETE CASCADE ON UPDATE CASCADE;
