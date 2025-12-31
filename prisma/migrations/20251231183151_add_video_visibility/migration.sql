-- CreateEnum
CREATE TYPE "VideoVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "visibility" "VideoVisibility" NOT NULL DEFAULT 'PRIVATE';

-- CreateIndex
CREATE INDEX "videos_visibility_idx" ON "videos"("visibility");
