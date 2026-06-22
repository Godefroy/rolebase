-- Remove the unused ChangeStatus thread activity type. It was only ever
-- synthesized client-side from log.threadId (now removed); no thread_activity
-- row uses it.
DELETE FROM "public"."thread_activity_type" WHERE "value" = 'ChangeStatus';
