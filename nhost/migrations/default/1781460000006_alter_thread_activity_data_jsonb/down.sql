ALTER TABLE "public"."thread_activity" ALTER COLUMN "data" TYPE json USING "data"::json;
