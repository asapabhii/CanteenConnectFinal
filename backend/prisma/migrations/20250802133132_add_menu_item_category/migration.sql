-- CreateEnum
CREATE TYPE "public"."ItemCategory" AS ENUM ('VEG', 'NON_VEG', 'BEVERAGE', 'DESSERT', 'SNACK');

-- AlterTable
ALTER TABLE "public"."MenuItem" ADD COLUMN     "category" "public"."ItemCategory";
