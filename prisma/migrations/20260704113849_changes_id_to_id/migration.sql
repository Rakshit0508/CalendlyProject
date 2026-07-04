/*
  Warnings:

  - You are about to drop the column `userID` on the `availability_exceptions` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `availability_rules` table. All the data in the column will be lost.
  - You are about to drop the column `hostID` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `hostID` on the `slots` table. All the data in the column will be lost.
  - Added the required column `userId` to the `availability_exceptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `availability_rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostId` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostId` to the `slots` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "availability_exceptions" DROP CONSTRAINT "availability_exceptions_userID_fkey";

-- DropForeignKey
ALTER TABLE "availability_rules" DROP CONSTRAINT "availability_rules_userID_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_hostID_fkey";

-- DropForeignKey
ALTER TABLE "slots" DROP CONSTRAINT "slots_hostID_fkey";

-- DropIndex
DROP INDEX "availability_exceptions_userID_date_idx";

-- DropIndex
DROP INDEX "availability_rules_userID_weekday_idx";

-- DropIndex
DROP INDEX "bookings_hostID_createdAt_idx";

-- DropIndex
DROP INDEX "slots_hostID_startAt_idx";

-- AlterTable
ALTER TABLE "availability_exceptions" DROP COLUMN "userID",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "availability_rules" DROP COLUMN "userID",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "hostID",
ADD COLUMN     "hostId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "slots" DROP COLUMN "hostID",
ADD COLUMN     "hostId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "availability_exceptions_userId_date_idx" ON "availability_exceptions"("userId", "date");

-- CreateIndex
CREATE INDEX "availability_rules_userId_weekday_idx" ON "availability_rules"("userId", "weekday");

-- CreateIndex
CREATE INDEX "bookings_hostId_createdAt_idx" ON "bookings"("hostId", "createdAt");

-- CreateIndex
CREATE INDEX "slots_hostId_startAt_idx" ON "slots"("hostId", "startAt");

-- AddForeignKey
ALTER TABLE "availability_rules" ADD CONSTRAINT "availability_rules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_exceptions" ADD CONSTRAINT "availability_exceptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
