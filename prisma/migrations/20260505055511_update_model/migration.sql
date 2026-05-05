-- CreateTable
CREATE TABLE "joinUser" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "referralcodeId" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "midName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "landerName" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "joinUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "joinUser_code_key" ON "joinUser"("code");

-- CreateIndex
CREATE UNIQUE INDEX "joinUser_email_key" ON "joinUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "joinUser_landerName_key" ON "joinUser"("landerName");

-- AddForeignKey
ALTER TABLE "joinUser" ADD CONSTRAINT "joinUser_referralcodeId_fkey" FOREIGN KEY ("referralcodeId") REFERENCES "referralCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
