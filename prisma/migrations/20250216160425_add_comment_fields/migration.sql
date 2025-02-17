-- DropIndex
DROP INDEX "Comment_parentId_idx";

-- DropIndex
DROP INDEX "Comment_projectId_idx";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "fileUrls" SET DEFAULT ARRAY[]::TEXT[];
