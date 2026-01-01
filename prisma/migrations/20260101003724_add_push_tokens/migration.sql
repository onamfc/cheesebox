-- DropForeignKey
ALTER TABLE "video_group_shares" DROP CONSTRAINT "video_group_shares_shared_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_team_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "push_token" TEXT;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_group_shares" ADD CONSTRAINT "video_group_shares_shared_by_user_id_fkey" FOREIGN KEY ("shared_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
