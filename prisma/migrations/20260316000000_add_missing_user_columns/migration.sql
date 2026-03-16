-- CreateEnum (only if it doesn't already exist, e.g. from a prior db push)
DO $$ BEGIN
  CREATE TYPE "AuthProvider" AS ENUM ('CREDENTIALS', 'GOOGLE', 'GITHUB', 'MICROSOFT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable: make password_hash nullable (for OAuth users who have no password)
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;

-- AlterTable: add missing columns to users (IF NOT EXISTS for idempotency)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "image" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "provider" "AuthProvider" DEFAULT 'CREDENTIALS';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "provider_id" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboarding_completed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboarding_path" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboarding_completed_at" TIMESTAMP(3);

-- CreateIndex (only if it doesn't already exist)
CREATE UNIQUE INDEX IF NOT EXISTS "users_provider_provider_id_key" ON "users"("provider", "provider_id");
