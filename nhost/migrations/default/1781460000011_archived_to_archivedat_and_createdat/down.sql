-- Reverse of up.sql: restore the boolean `archived` flag and drop the added
-- `createdAt` / `archivedAt` columns.

-- ============================================================================
-- 5'. Drop the views that reference `archivedAt` (recreated on `archived` below)
-- ============================================================================
DROP VIEW "public"."circle_participant";
DROP VIEW "public"."circle_leader";
DROP VIEW "public"."news";

-- ============================================================================
-- 4'. Drop the partial unique indexes on `archivedAt IS NULL`, restore the
-- thread_activity / user_app full unique constraints
-- ============================================================================
DROP INDEX "public"."user_app_active_unique";
ALTER TABLE "public"."user_app"
  ADD CONSTRAINT "user_app_userId_type_key" UNIQUE ("userId", "type");

DROP INDEX "public"."thread_activity_active_unique";
ALTER TABLE "public"."thread_activity"
  ADD CONSTRAINT "thread_activity_threadId_refMeetingId_type_key"
  UNIQUE ("threadId", "refMeetingId", "type");

DROP INDEX "public"."circle_link_active_unique";
DROP INDEX "public"."circle_member_active_unique";

-- ============================================================================
-- 3'. Restore `archived` (boolean) from `archivedAt`
-- ============================================================================

-- circle
ALTER TABLE "public"."circle" ADD COLUMN "archived" boolean NOT NULL DEFAULT false;
UPDATE "public"."circle" SET "archived" = ("archivedAt" IS NOT NULL);
ALTER TABLE "public"."circle" DROP COLUMN "archivedAt";

-- circle_link
ALTER TABLE "public"."circle_link" ADD COLUMN "archived" boolean NOT NULL DEFAULT false;
UPDATE "public"."circle_link" SET "archived" = ("archivedAt" IS NOT NULL);
ALTER TABLE "public"."circle_link" DROP COLUMN "archivedAt";

-- circle_member
ALTER TABLE "public"."circle_member" ADD COLUMN "archived" boolean NOT NULL DEFAULT false;
UPDATE "public"."circle_member" SET "archived" = ("archivedAt" IS NOT NULL);
ALTER TABLE "public"."circle_member" DROP COLUMN "archivedAt";

-- decision
ALTER TABLE "public"."decision" ADD COLUMN "archived" boolean NOT NULL DEFAULT false;
UPDATE "public"."decision" SET "archived" = ("archivedAt" IS NOT NULL);
ALTER TABLE "public"."decision" DROP COLUMN "archivedAt";

-- meeting
ALTER TABLE "public"."meeting" ADD COLUMN "archived" boolean NOT NULL DEFAULT false;
UPDATE "public"."meeting" SET "archived" = ("archivedAt" IS NOT NULL);
ALTER TABLE "public"."meeting" DROP COLUMN "archivedAt";

-- member
ALTER TABLE "public"."member" ADD COLUMN "archived" boolean NOT NULL DEFAULT false;
UPDATE "public"."member" SET "archived" = ("archivedAt" IS NOT NULL);
ALTER TABLE "public"."member" DROP COLUMN "archivedAt";

-- org
ALTER TABLE "public"."org" ADD COLUMN "archived" boolean NOT NULL DEFAULT false;
UPDATE "public"."org" SET "archived" = ("archivedAt" IS NOT NULL);
ALTER TABLE "public"."org" DROP COLUMN "archivedAt";

-- role
ALTER TABLE "public"."role" ADD COLUMN "archived" boolean NOT NULL DEFAULT false;
UPDATE "public"."role" SET "archived" = ("archivedAt" IS NOT NULL);
ALTER TABLE "public"."role" DROP COLUMN "archivedAt";

-- task
ALTER TABLE "public"."task" ADD COLUMN "archived" boolean NOT NULL DEFAULT false;
UPDATE "public"."task" SET "archived" = ("archivedAt" IS NOT NULL);
ALTER TABLE "public"."task" DROP COLUMN "archivedAt";

-- thread
ALTER TABLE "public"."thread" ADD COLUMN "archived" boolean NOT NULL DEFAULT false;
UPDATE "public"."thread" SET "archived" = ("archivedAt" IS NOT NULL);
ALTER TABLE "public"."thread" DROP COLUMN "archivedAt";

-- Recreate the original partial unique indexes on `archived = false`
CREATE UNIQUE INDEX "circle_member_active_unique"
  ON "public"."circle_member" ("circleId", "memberId")
  WHERE "archived" = false;

CREATE UNIQUE INDEX "circle_link_active_unique"
  ON "public"."circle_link" ("parentId", "circleId")
  WHERE "archived" = false;

-- ============================================================================
-- 2'. Drop the added `archivedAt` columns
-- ============================================================================
ALTER TABLE "public"."api_key" DROP COLUMN "archivedAt";
ALTER TABLE "public"."meeting_template" DROP COLUMN "archivedAt";
ALTER TABLE "public"."meeting_recurring" DROP COLUMN "archivedAt";
ALTER TABLE "public"."org_subscription" DROP COLUMN "archivedAt";
ALTER TABLE "public"."thread_activity" DROP COLUMN "archivedAt";
ALTER TABLE "public"."user_app" DROP COLUMN "archivedAt";

-- ============================================================================
-- 1'. Drop the added `createdAt` columns
-- ============================================================================
ALTER TABLE "public"."circle" DROP COLUMN "createdAt";
ALTER TABLE "public"."role" DROP COLUMN "createdAt";
ALTER TABLE "public"."meeting_template" DROP COLUMN "createdAt";
ALTER TABLE "public"."member" DROP COLUMN "createdAt";
ALTER TABLE "public"."org_file" DROP COLUMN "createdAt";
ALTER TABLE "public"."org_subscription" DROP COLUMN "createdAt";

-- ============================================================================
-- 0'. Recreate the dependent views on the boolean `archived` column
-- ============================================================================

CREATE VIEW "public"."circle_leader" AS
 WITH sub_circle_leader AS (
         SELECT sub_circle."parentId" AS "circleId",
            cm."memberId",
            sub_circle."orgId"
           FROM circle sub_circle
             JOIN role r ON sub_circle."roleId" = r.id
             JOIN circle_member cm ON sub_circle.id = cm."circleId"
          WHERE r."parentLink" = true AND sub_circle.archived = false AND cm.archived = false
        )
 SELECT c.id AS "circleId",
    cm."memberId",
    c."orgId"
   FROM circle c
     LEFT JOIN circle_member cm ON c.id = cm."circleId"
  WHERE NOT (EXISTS ( SELECT 1
           FROM sub_circle_leader scl
          WHERE scl."circleId" = c.id)) AND cm.archived = false
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
  WHERE cm.archived = false
UNION
 SELECT c."parentId" AS "circleId",
    l."memberId"
   FROM circle c
     JOIN circle_leader l ON l."circleId" = c.id
  WHERE c."parentId" IS NOT NULL AND c.archived = false
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
  WHERE thread.archived = false AND thread.status <> 'Preparation'::text
UNION
 SELECT decision.id,
    decision."orgId",
    NULL::uuid AS "threadId",
    decision.id AS "decisionId",
    NULL::uuid AS "meetingId",
    decision."createdAt",
    decision."circleId"
   FROM decision
  WHERE decision.archived = false
UNION
 SELECT meeting.id,
    meeting."orgId",
    NULL::uuid AS "threadId",
    NULL::uuid AS "decisionId",
    meeting.id AS "meetingId",
    meeting."endDate" AS "createdAt",
    meeting."circleId"
   FROM meeting
  WHERE meeting.archived = false AND meeting.ended = true;
