import { PrismaClient, Role, ItemCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- 1. CLEAN UP EXISTING DATA ---
  await prisma.review.deleteMany();
  await prisma.penalty.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.outlet.deleteMany();
  console.log('Cleared existing data.');
}