/*
  Warnings:

  - You are about to drop the `_TaskLabels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TaskLabels" DROP CONSTRAINT "_TaskLabels_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaskLabels" DROP CONSTRAINT "_TaskLabels_B_fkey";

-- DropTable
DROP TABLE "_TaskLabels";
