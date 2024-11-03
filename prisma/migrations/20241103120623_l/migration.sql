/*
  Warnings:

  - You are about to drop the `UserPrivilege` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "UserPrivilege" DROP CONSTRAINT "UserPrivilege_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "UserPrivilege";
