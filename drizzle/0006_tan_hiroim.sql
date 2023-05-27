ALTER TABLE "providers" DROP CONSTRAINT "providers_id_user_id";
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'providers'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "providers" DROP CONSTRAINT "<constraint_name>";
ALTER TABLE "providers" ALTER COLUMN "user_id" DROP NOT NULL;
ALTER TABLE "providers" DROP COLUMN IF EXISTS "id";
ALTER TABLE "providers" ADD CONSTRAINT "providers_type_user_id" PRIMARY KEY("type","user_id");