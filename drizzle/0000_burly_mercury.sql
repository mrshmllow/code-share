CREATE TABLE IF NOT EXISTS "gists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"text" text NOT NULL,
	"ai_name_reason" text,
	"visible" boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
