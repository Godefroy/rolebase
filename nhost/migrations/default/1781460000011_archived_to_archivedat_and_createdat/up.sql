-- Migrate the boolean `archived` soft-delete flag to a nullable `archivedAt`
-- timestamp (NULL = active), add missing `createdAt` columns, add `archivedAt`
-- to the tables that move from hard- to soft-delete, make the affected unique
-- constraints apply to active rows only, and recreate the dependent views.

-- ============================================================================
-- 0. Lock every modified table up front so the long backfills below never
-- acquire a new table lock mid-transaction and deadlock with live reads (event
-- triggers, cron, participants cache, ...).
--
-- Acquire with NOWAIT inside a retry loop: NOWAIT never waits on a lock, so it
-- can't be part of a deadlock cycle. Each attempt grabs every table atomically
-- (the subtransaction releases any partial locks on failure) or backs off and
-- retries, instead of holding some locks while waiting for others. After all
-- locks are held, the rest of the migration acquires no new table locks.
-- ============================================================================
SET lock_timeout = '5s';
DO $$
DECLARE
  locked boolean := false;
BEGIN
  FOR i IN 1..100 LOOP
    BEGIN
      LOCK TABLE
        "public"."api_key",
        "public"."circle",
        "public"."circle_link",
        "public"."circle_member",
        "public"."decision",
        "public"."meeting",
        "public"."meeting_recurring",
        "public"."meeting_template",
        "public"."member",
        "public"."org",
        "public"."org_file",
        "public"."org_subscription",
        "public"."role",
        "public"."task",
        "public"."thread",
        "public"."thread_activity",
        "public"."user_app"
        IN ACCESS EXCLUSIVE MODE NOWAIT;
      locked := true;
    EXCEPTION
      WHEN lock_not_available THEN
        PERFORM pg_sleep(0.3);
    END;
    EXIT WHEN locked;
  END LOOP;
  IF NOT locked THEN
    RAISE EXCEPTION 'Could not acquire table locks for the migration after retries (database too busy); retry the deploy';
  END IF;
END $$;

-- ============================================================================
-- 1. Add `createdAt` columns
-- ============================================================================

-- circle.createdAt: backfill from creation logs when available, else now()
ALTER TABLE "public"."circle" ADD COLUMN "createdAt" timestamptz;
UPDATE "public"."circle" c
SET "createdAt" = sub.created
FROM (
  SELECT e->>'id' AS id, min(l."createdAt") AS created
  FROM "public"."log" l, jsonb_array_elements((l.changes::jsonb)->'circles') e
  WHERE e->>'type' = 'Create'
  GROUP BY e->>'id'
) sub
WHERE sub.id = c.id::text;
UPDATE "public"."circle" SET "createdAt" = now() WHERE "createdAt" IS NULL;
ALTER TABLE "public"."circle" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "public"."circle" ALTER COLUMN "createdAt" SET NOT NULL;

-- role.createdAt: backfill from creation logs when available, else now()
ALTER TABLE "public"."role" ADD COLUMN "createdAt" timestamptz;
UPDATE "public"."role" r
SET "createdAt" = sub.created
FROM (
  SELECT e->>'id' AS id, min(l."createdAt") AS created
  FROM "public"."log" l, jsonb_array_elements((l.changes::jsonb)->'roles') e
  WHERE e->>'type' = 'Create'
  GROUP BY e->>'id'
) sub
WHERE sub.id = r.id::text;
UPDATE "public"."role" SET "createdAt" = now() WHERE "createdAt" IS NULL;
ALTER TABLE "public"."role" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "public"."role" ALTER COLUMN "createdAt" SET NOT NULL;

-- Remaining tables: createdAt defaults to now() for existing and future rows
ALTER TABLE "public"."meeting_template" ADD COLUMN "createdAt" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "public"."member" ADD COLUMN "createdAt" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "public"."org_file" ADD COLUMN "createdAt" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "public"."org_subscription" ADD COLUMN "createdAt" timestamptz NOT NULL DEFAULT now();

-- ============================================================================
-- 2. Add `archivedAt` columns (nullable, NULL = active)
-- ============================================================================
ALTER TABLE "public"."api_key" ADD COLUMN "archivedAt" timestamptz;
ALTER TABLE "public"."meeting_template" ADD COLUMN "archivedAt" timestamptz;
ALTER TABLE "public"."meeting_recurring" ADD COLUMN "archivedAt" timestamptz;
ALTER TABLE "public"."org_subscription" ADD COLUMN "archivedAt" timestamptz;
ALTER TABLE "public"."thread_activity" ADD COLUMN "archivedAt" timestamptz;
ALTER TABLE "public"."user_app" ADD COLUMN "archivedAt" timestamptz;

-- ============================================================================
-- 3. Rename `archived` (boolean) -> `archivedAt` (nullable timestamptz)
-- ============================================================================

-- Drop the views that reference `archived` (recreated at the end on archivedAt)
DROP VIEW "public"."circle_participant";
DROP VIEW "public"."circle_leader";
DROP VIEW "public"."news";

-- Drop the partial unique indexes that reference `archived` before dropping it
DROP INDEX "public"."circle_member_active_unique";
DROP INDEX "public"."circle_link_active_unique";

-- circle
ALTER TABLE "public"."circle" ADD COLUMN "archivedAt" timestamptz;
UPDATE "public"."circle" SET "archivedAt" = now() WHERE "archived" = true;
ALTER TABLE "public"."circle" DROP COLUMN "archived";

-- circle_link
ALTER TABLE "public"."circle_link" ADD COLUMN "archivedAt" timestamptz;
UPDATE "public"."circle_link" SET "archivedAt" = now() WHERE "archived" = true;
ALTER TABLE "public"."circle_link" DROP COLUMN "archived";

-- circle_member: rename + refine createdAt / archivedAt from activity logs when
-- available (done before dropping `archived` so the Hasura event triggers, which
-- still reference `archived` until metadata is re-applied, keep working).
-- createdAt from the earliest `Create` change, archivedAt from the latest
-- archival change (`Update` setting archived=true); rows without a matching log
-- keep their existing createdAt / the now() fallback.
ALTER TABLE "public"."circle_member" ADD COLUMN "archivedAt" timestamptz;
UPDATE "public"."circle_member" SET "archivedAt" = now() WHERE "archived" = true;
UPDATE "public"."circle_member" cm
SET "createdAt" = sub.created
FROM (
  SELECT e->>'id' AS id, min(l."createdAt") AS created
  FROM "public"."log" l, jsonb_array_elements((l.changes::jsonb)->'circlesMembers') e
  WHERE e->>'type' = 'Create'
  GROUP BY e->>'id'
) sub
WHERE sub.id = cm.id::text;
UPDATE "public"."circle_member" cm
SET "archivedAt" = sub.archived_at
FROM (
  SELECT e->>'id' AS id, max(l."createdAt") AS archived_at
  FROM "public"."log" l, jsonb_array_elements((l.changes::jsonb)->'circlesMembers') e
  WHERE e->>'type' = 'Update' AND (e->'newData'->>'archived') = 'true'
  GROUP BY e->>'id'
) sub
WHERE sub.id = cm.id::text AND cm."archived" = true;
ALTER TABLE "public"."circle_member" DROP COLUMN "archived";

-- decision
ALTER TABLE "public"."decision" ADD COLUMN "archivedAt" timestamptz;
UPDATE "public"."decision" SET "archivedAt" = now() WHERE "archived" = true;
ALTER TABLE "public"."decision" DROP COLUMN "archived";

-- meeting
ALTER TABLE "public"."meeting" ADD COLUMN "archivedAt" timestamptz;
UPDATE "public"."meeting" SET "archivedAt" = now() WHERE "archived" = true;
ALTER TABLE "public"."meeting" DROP COLUMN "archived";

-- member
ALTER TABLE "public"."member" ADD COLUMN "archivedAt" timestamptz;
UPDATE "public"."member" SET "archivedAt" = now() WHERE "archived" = true;
ALTER TABLE "public"."member" DROP COLUMN "archived";

-- org
ALTER TABLE "public"."org" ADD COLUMN "archivedAt" timestamptz;
UPDATE "public"."org" SET "archivedAt" = now() WHERE "archived" = true;
ALTER TABLE "public"."org" DROP COLUMN "archived";

-- role
ALTER TABLE "public"."role" ADD COLUMN "archivedAt" timestamptz;
UPDATE "public"."role" SET "archivedAt" = now() WHERE "archived" = true;
ALTER TABLE "public"."role" DROP COLUMN "archived";

-- task
ALTER TABLE "public"."task" ADD COLUMN "archivedAt" timestamptz;
UPDATE "public"."task" SET "archivedAt" = now() WHERE "archived" = true;
ALTER TABLE "public"."task" DROP COLUMN "archived";

-- thread
ALTER TABLE "public"."thread" ADD COLUMN "archivedAt" timestamptz;
UPDATE "public"."thread" SET "archivedAt" = now() WHERE "archived" = true;
ALTER TABLE "public"."thread" DROP COLUMN "archived";

-- ============================================================================
-- 4. Rebuild the partial unique indexes on `archivedAt IS NULL`
-- ============================================================================
CREATE UNIQUE INDEX "circle_member_active_unique"
  ON "public"."circle_member" ("circleId", "memberId")
  WHERE "archivedAt" IS NULL;

CREATE UNIQUE INDEX "circle_link_active_unique"
  ON "public"."circle_link" ("parentId", "circleId")
  WHERE "archivedAt" IS NULL;

-- thread_activity and user_app are now soft-deleted via archivedAt instead of
-- being physically deleted; make their uniqueness apply only to active rows so
-- an archived row no longer blocks recreating/reconnecting the same key.
ALTER TABLE "public"."thread_activity"
  DROP CONSTRAINT "thread_activity_threadId_refMeetingId_type_key";
CREATE UNIQUE INDEX "thread_activity_active_unique"
  ON "public"."thread_activity" ("threadId", "refMeetingId", "type")
  WHERE "archivedAt" IS NULL;

ALTER TABLE "public"."user_app"
  DROP CONSTRAINT "user_app_userId_type_key";
CREATE UNIQUE INDEX "user_app_active_unique"
  ON "public"."user_app" ("userId", "type")
  WHERE "archivedAt" IS NULL;

-- ============================================================================
-- 5. Recreate the dependent views on `archivedAt IS NULL`
-- ============================================================================

CREATE VIEW "public"."circle_leader" AS
 WITH sub_circle_leader AS (
         SELECT sub_circle."parentId" AS "circleId",
            cm."memberId",
            sub_circle."orgId"
           FROM circle sub_circle
             JOIN role r ON sub_circle."roleId" = r.id
             JOIN circle_member cm ON sub_circle.id = cm."circleId"
          WHERE r."parentLink" = true AND sub_circle."archivedAt" IS NULL AND cm."archivedAt" IS NULL
        )
 SELECT c.id AS "circleId",
    cm."memberId",
    c."orgId"
   FROM circle c
     JOIN circle_member cm ON c.id = cm."circleId"
  WHERE NOT (EXISTS ( SELECT 1
           FROM sub_circle_leader scl
          WHERE scl."circleId" = c.id)) AND cm."archivedAt" IS NULL
UNION
 SELECT scl."circleId",
    scl."memberId",
    scl."orgId"
   FROM sub_circle_leader scl;

CREATE VIEW "public"."circle_participant" AS
 SELECT c.id AS "circleId",
    cm."memberId"
   FROM circle c
     JOIN circle_member cm ON c.id = cm."circleId"
  WHERE cm."archivedAt" IS NULL
UNION
 SELECT c."parentId" AS "circleId",
    l."memberId"
   FROM circle c
     JOIN circle_leader l ON l."circleId" = c.id
  WHERE c."parentId" IS NOT NULL AND c."archivedAt" IS NULL
UNION
 SELECT cl."parentId" AS "circleId",
    l."memberId"
   FROM circle_link cl
     JOIN circle_leader l ON l."circleId" = cl."circleId";

CREATE VIEW "public"."news" AS
 SELECT thread.id,
    thread."orgId",
    thread.id AS "threadId",
    NULL::uuid AS "decisionId",
    NULL::uuid AS "meetingId",
    thread."createdAt",
    thread."circleId"
   FROM thread
  WHERE thread."archivedAt" IS NULL AND thread.status <> 'Preparation'::text
UNION
 SELECT decision.id,
    decision."orgId",
    NULL::uuid AS "threadId",
    decision.id AS "decisionId",
    NULL::uuid AS "meetingId",
    decision."createdAt",
    decision."circleId"
   FROM decision
  WHERE decision."archivedAt" IS NULL
UNION
 SELECT meeting.id,
    meeting."orgId",
    NULL::uuid AS "threadId",
    NULL::uuid AS "decisionId",
    meeting.id AS "meetingId",
    meeting."endDate" AS "createdAt",
    meeting."circleId"
   FROM meeting
  WHERE meeting."archivedAt" IS NULL AND meeting.ended = true;
