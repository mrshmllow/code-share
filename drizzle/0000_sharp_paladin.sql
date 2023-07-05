CREATE TABLE IF NOT EXISTS "accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_provider_account_id" PRIMARY KEY("provider","provider_account_id");

CREATE TABLE IF NOT EXISTS "gists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"text" text NOT NULL,
	"ai_name_reason" text,
	"visible" boolean DEFAULT false NOT NULL,
	"ai_completed" boolean DEFAULT false NOT NULL,
	"ai_tags" text,
	"owner" text NOT NULL,
	"language" text
);

CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires" timestamp NOT NULL,
	"session_token" text NOT NULL,
	"user_id" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"image" text
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_identifier_token" PRIMARY KEY("identifier","token");
