-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- AlterTable: Make user_id nullable on aws_credentials (Phase 1 non-breaking)
ALTER TABLE "aws_credentials" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable: Add team_id to aws_credentials
ALTER TABLE "aws_credentials" ADD COLUMN "team_id" TEXT;

-- AlterTable: Make user_id nullable on email_credentials (Phase 1 non-breaking)
ALTER TABLE "email_credentials" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable: Add team_id to email_credentials
ALTER TABLE "email_credentials" ADD COLUMN "team_id" TEXT;

-- AlterTable: Add team_id to videos
ALTER TABLE "videos" ADD COLUMN "team_id" TEXT;

-- CreateTable: teams
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable: team_members
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable: share_groups
CREATE TABLE "share_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "team_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "share_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable: share_group_members
CREATE TABLE "share_group_members" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "share_group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable: video_group_shares
CREATE TABLE "video_group_shares" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "shared_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_group_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_slug_key" ON "teams"("slug");

-- CreateIndex
CREATE INDEX "team_members_user_id_idx" ON "team_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_team_id_user_id_key" ON "team_members"("team_id", "user_id");

-- CreateIndex
CREATE INDEX "share_groups_user_id_idx" ON "share_groups"("user_id");

-- CreateIndex
CREATE INDEX "share_groups_team_id_idx" ON "share_groups"("team_id");

-- CreateIndex
CREATE INDEX "share_group_members_email_idx" ON "share_group_members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "share_group_members_group_id_email_key" ON "share_group_members"("group_id", "email");

-- CreateIndex
CREATE INDEX "video_group_shares_group_id_idx" ON "video_group_shares"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "video_group_shares_video_id_group_id_key" ON "video_group_shares"("video_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "aws_credentials_team_id_key" ON "aws_credentials"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_credentials_team_id_key" ON "email_credentials"("team_id");

-- CreateIndex
CREATE INDEX "videos_team_id_idx" ON "videos"("team_id");

-- AddForeignKey
ALTER TABLE "aws_credentials" ADD CONSTRAINT "aws_credentials_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_credentials" ADD CONSTRAINT "email_credentials_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_groups" ADD CONSTRAINT "share_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_groups" ADD CONSTRAINT "share_groups_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_group_members" ADD CONSTRAINT "share_group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "share_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_group_shares" ADD CONSTRAINT "video_group_shares_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_group_shares" ADD CONSTRAINT "video_group_shares_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "share_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_group_shares" ADD CONSTRAINT "video_group_shares_shared_by_user_id_fkey" FOREIGN KEY ("shared_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
