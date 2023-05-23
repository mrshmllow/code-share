ALTER TABLE "gists" ALTER COLUMN "text" DROP NOT NULL;
ALTER TABLE "gists" ADD COLUMN "description" text;
ALTER TABLE "gists" ADD COLUMN "ai_name_reason" boolean;