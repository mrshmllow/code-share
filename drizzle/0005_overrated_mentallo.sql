ALTER TABLE "providers" ALTER COLUMN "id" SET DATA TYPE serial;
ALTER TABLE "providers" ADD COLUMN "user_id" uuid NOT NULL;
ALTER TABLE "providers" ADD CONSTRAINT "providers_id_user_id" PRIMARY KEY("id","user_id");