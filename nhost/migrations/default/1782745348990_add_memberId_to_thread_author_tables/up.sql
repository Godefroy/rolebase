-- Add a stable memberId reference to the thread tables that currently identify a
-- member only by userId. Archiving a member nulls member.userId (to satisfy the
-- unique (orgId, userId) constraint and allow re-inviting), which severs the
-- userId-based link and makes archived authors/reactors/voters show as "?".
-- memberId is set explicitly at insert time (guarded by Hasura permissions), so
-- there is never a row without it going forward.

ALTER TABLE "public"."thread_activity" ADD COLUMN "memberId" uuid;
ALTER TABLE "public"."thread_activity"
  ADD CONSTRAINT "thread_activity_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "public"."member" ("id")
  ON UPDATE restrict ON DELETE set null;
CREATE INDEX "thread_activity_memberId_idx" ON "public"."thread_activity" ("memberId");

ALTER TABLE "public"."thread_activity_reaction" ADD COLUMN "memberId" uuid;
ALTER TABLE "public"."thread_activity_reaction"
  ADD CONSTRAINT "thread_activity_reaction_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "public"."member" ("id")
  ON UPDATE restrict ON DELETE set null;
CREATE INDEX "thread_activity_reaction_memberId_idx" ON "public"."thread_activity_reaction" ("memberId");

ALTER TABLE "public"."thread_poll_answer" ADD COLUMN "memberId" uuid;
ALTER TABLE "public"."thread_poll_answer"
  ADD CONSTRAINT "thread_poll_answer_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "public"."member" ("id")
  ON UPDATE restrict ON DELETE set null;
CREATE INDEX "thread_poll_answer_memberId_idx" ON "public"."thread_poll_answer" ("memberId");

ALTER TABLE "public"."thread_proposal_vote" ADD COLUMN "memberId" uuid;
ALTER TABLE "public"."thread_proposal_vote"
  ADD CONSTRAINT "thread_proposal_vote_memberId_fkey"
  FOREIGN KEY ("memberId") REFERENCES "public"."member" ("id")
  ON UPDATE restrict ON DELETE set null;
CREATE INDEX "thread_proposal_vote_memberId_idx" ON "public"."thread_proposal_vote" ("memberId");

-- Resolve a member from (org, user) for backfilling, in three steps:
--   1. active member (member.userId still set)
--   2. log table, which keeps (orgId, userId) -> memberId after archiving
--   3. unique archived member of the same org whose name matches the user's
--      display name (last resort, only when exactly one matches)
-- Temporary: dropped at the end of this migration.
CREATE FUNCTION "public"."tmp_resolve_thread_member"(p_org uuid, p_user uuid)
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT COALESCE(
    (SELECT m."id" FROM "public"."member" m
       WHERE m."orgId" = p_org AND m."userId" = p_user LIMIT 1),
    (SELECT lg."memberId" FROM "public"."log" lg
       WHERE lg."orgId" = p_org AND lg."userId" = p_user AND lg."memberId" IS NOT NULL
       ORDER BY lg."createdAt" DESC LIMIT 1),
    (SELECT m."id" FROM "public"."member" m
       JOIN "auth"."users" u ON u."id" = p_user
       WHERE m."orgId" = p_org AND m."archivedAt" IS NOT NULL AND m."name" = u."display_name"
         AND (SELECT count(*) FROM "public"."member" m2 JOIN "auth"."users" u2 ON u2."id" = p_user
                WHERE m2."orgId" = p_org AND m2."archivedAt" IS NOT NULL
                  AND m2."name" = u2."display_name") = 1
       LIMIT 1)
  );
$$;

-- Backfill the new columns.
UPDATE "public"."thread_activity" ta
SET "memberId" = "public"."tmp_resolve_thread_member"(t."orgId", ta."userId")
FROM "public"."thread" t
WHERE t."id" = ta."threadId" AND ta."memberId" IS NULL;

UPDATE "public"."thread_activity_reaction" r
SET "memberId" = "public"."tmp_resolve_thread_member"(t."orgId", r."userId")
FROM "public"."thread_activity" a
JOIN "public"."thread" t ON t."id" = a."threadId"
WHERE a."id" = r."activityId" AND r."memberId" IS NULL;

UPDATE "public"."thread_poll_answer" p
SET "memberId" = "public"."tmp_resolve_thread_member"(t."orgId", p."userId")
FROM "public"."thread_activity" a
JOIN "public"."thread" t ON t."id" = a."threadId"
WHERE a."id" = p."activityId" AND p."memberId" IS NULL;

UPDATE "public"."thread_proposal_vote" v
SET "memberId" = "public"."tmp_resolve_thread_member"(t."orgId", v."userId")
FROM "public"."thread_activity" a
JOIN "public"."thread" t ON t."id" = a."threadId"
WHERE a."id" = v."activityId" AND v."memberId" IS NULL;

-- Backfill memberId inside the JSON vote snapshots of past proposal resolution
-- events (thread_activity.data.votes), where it is missing. userId is kept.
UPDATE "public"."thread_activity" ta
SET "data" = jsonb_set(
  ta."data",
  '{votes}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN (elem->>'memberId') IS NOT NULL THEN elem
        ELSE elem || jsonb_strip_nulls(jsonb_build_object(
          'memberId',
          "public"."tmp_resolve_thread_member"(t."orgId", (elem->>'userId')::uuid)
        ))
      END
      ORDER BY ord
    )
    FROM jsonb_array_elements(ta."data"->'votes') WITH ORDINALITY AS arr(elem, ord)
  )
)
FROM "public"."thread" t
WHERE t."id" = ta."threadId"
  AND ta."type" = 'ProposalEvent'
  AND ta."data"->>'event' = 'resolution'
  AND jsonb_typeof(ta."data"->'votes') = 'array'
  AND jsonb_array_length(ta."data"->'votes') > 0;

DROP FUNCTION "public"."tmp_resolve_thread_member"(uuid, uuid);
