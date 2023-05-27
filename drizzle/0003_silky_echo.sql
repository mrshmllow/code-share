CREATE TABLE IF NOT EXISTS "providers" (
	"id" uuid
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);

ALTER TABLE "gists" ADD COLUMN "owner" text NOT NULL;