-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "rate" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "distance" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "driverid" INTEGER NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_driverid_fkey" FOREIGN KEY ("driverid") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
