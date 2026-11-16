-- CreateTable
CREATE TABLE "trackExport" (
    "id" TEXT NOT NULL,
    "landerId" TEXT NOT NULL,
    "pulsetrackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trackExport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trackExport" ADD CONSTRAINT "trackExport_pulsetrackId_fkey" FOREIGN KEY ("pulsetrackId") REFERENCES "pulsetrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trackExport" ADD CONSTRAINT "trackExport_landerId_fkey" FOREIGN KEY ("landerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
