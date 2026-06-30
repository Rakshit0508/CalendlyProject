/*
  Warnings:

  - You are about to drop the column `hostid` on the `event_types` table. All the data in the column will be lost.
  - Added the required column `hostId` to the `event_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event_types" DROP CONSTRAINT "event_types_hostid_fkey";

-- AlterTable
ALTER TABLE "event_types" DROP COLUMN "hostid",
ADD COLUMN     "hostId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "event_types" ADD CONSTRAINT "event_types_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
