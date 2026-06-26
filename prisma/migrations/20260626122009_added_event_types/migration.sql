-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "event_types" (
    "id" SERIAL NOT NULL,
    "hostid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "locationType" TEXT NOT NULL DEFAULT 'Online',
    "locationValue" TEXT,
    "bufferBeforeMinutes" INTEGER NOT NULL DEFAULT 0,
    "bufferAfterMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_types" ADD CONSTRAINT "event_types_hostid_fkey" FOREIGN KEY ("hostid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
