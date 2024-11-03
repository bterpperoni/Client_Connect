/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "UserPrivilege" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "isUser" BOOLEAN NOT NULL DEFAULT true,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPrivilege_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPrivilege_userId_key" ON "UserPrivilege"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "UserPrivilege"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
