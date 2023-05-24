CREATE TABLE IF NOT EXISTS "gists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"description" text,
	"text" text NOT NULL,
	"ai_name_reason" text
);
