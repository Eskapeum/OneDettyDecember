/*
  Warnings:

  - You are about to drop the column `search_vector` on the `packages` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_packages_search_vector";

-- AlterTable
ALTER TABLE "packages" DROP COLUMN "search_vector";
