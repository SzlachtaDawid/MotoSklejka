-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "destination" TEXT NOT NULL,
    "groupSize" INTEGER NOT NULL,
    "estimatedDuration" TEXT NOT NULL,
    "estimatedDistanceKm" INTEGER NOT NULL,
    "returnToStart" BOOLEAN NOT NULL DEFAULT false,
    "motorcycleTypes" TEXT[],
    "ridingStyle" TEXT[],
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trip_userId_startDateTime_idx" ON "Trip"("userId", "startDateTime");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
