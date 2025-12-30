-- CreateEnum
CREATE TYPE "EmailProvider" AS ENUM ('RESEND', 'AWS_SES', 'SENDGRID', 'SMTP');

-- CreateTable
CREATE TABLE "email_credentials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "EmailProvider" NOT NULL DEFAULT 'RESEND',
    "from_email" TEXT NOT NULL,
    "from_name" TEXT,
    "api_key" TEXT,
    "aws_access_key_id" TEXT,
    "aws_secret_key" TEXT,
    "aws_region" TEXT,
    "smtp_host" TEXT,
    "smtp_port" INTEGER,
    "smtp_username" TEXT,
    "smtp_password" TEXT,
    "smtp_secure" BOOLEAN,
    "last_validated" TIMESTAMP(3),
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_credentials_user_id_key" ON "email_credentials"("user_id");

-- AddForeignKey
ALTER TABLE "email_credentials" ADD CONSTRAINT "email_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
