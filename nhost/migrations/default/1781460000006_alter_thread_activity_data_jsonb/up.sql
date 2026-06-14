ALTER TABLE "public"."thread_activity" ALTER COLUMN "data" TYPE jsonb USING "data"::jsonb;
