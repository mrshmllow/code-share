ALTER TABLE "providers" ADD PRIMARY KEY ("id");
ALTER TABLE "providers" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "providers" ADD COLUMN "type" "providerType" NOT NULL;
ALTER TABLE "providers" ADD COLUMN "access_token" text NOT NULL;
ALTER TABLE "providers" ADD COLUMN "scope" text NOT NULL;
ALTER TABLE "providers" ADD COLUMN "token_type" text NOT NULL;