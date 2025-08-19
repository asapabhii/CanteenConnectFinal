/*
  Warnings:

  - A unique constraint covering the columns `[razorpayOrderId]` on the table `Penalty` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Penalty" ADD COLUMN     "razorpayOrderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Penalty_razorpayOrderId_key" ON "public"."Penalty"("razorpayOrderId");
