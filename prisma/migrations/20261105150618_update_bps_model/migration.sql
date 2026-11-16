/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `bpsStaff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bpsStaff_email_key" ON "bpsStaff"("email");
