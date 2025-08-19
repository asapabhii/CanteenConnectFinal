/*
  Warnings:

  - A unique constraint covering the columns `[razorpayOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "razorpayOrderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayOrderId_key" ON "public"."Order"("razorpayOrderId");
