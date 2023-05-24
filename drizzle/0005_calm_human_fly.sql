ALTER TABLE "gists" ALTER COLUMN "id" SET DATA TYPE uuid;
ALTER TABLE "gists" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();