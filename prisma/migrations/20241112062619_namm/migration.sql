/*
  Warnings:

  - You are about to drop the column `taskOrder` on the `OrderTaskListing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderTaskListing" DROP COLUMN "taskOrder",
ADD COLUMN     "taskId" TEXT[];
