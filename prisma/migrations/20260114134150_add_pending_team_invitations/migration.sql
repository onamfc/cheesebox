-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "email" TEXT,
ADD COLUMN     "status" "InvitationStatus" NOT NULL DEFAULT 'ACCEPTED',
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "team_members_email_idx" ON "team_members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_team_id_email_key" ON "team_members"("team_id", "email");

-- Update existing members to ACCEPTED status (since they already have accounts)
UPDATE "team_members" SET "status" = 'ACCEPTED' WHERE "user_id" IS NOT NULL;
