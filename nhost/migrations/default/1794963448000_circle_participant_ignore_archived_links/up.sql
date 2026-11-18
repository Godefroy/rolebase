-- An archived circle link (soft-deleted invited circle) must stop granting the
-- invited circle's leaders participation in the host circle, and an archived
-- circle has no participants on its own (not only through its archived
-- circle_member rows).
CREATE OR REPLACE VIEW "public"."circle_participant" AS
 SELECT c.id AS "circleId",
    cm."memberId"
   FROM circle c
     JOIN circle_member cm ON c.id = cm."circleId"
  WHERE cm."archivedAt" IS NULL AND c."archivedAt" IS NULL
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
     JOIN circle_leader l ON l."circleId" = cl."circleId"
  WHERE cl."archivedAt" IS NULL;

-- The view only shrinks: drop cached grants it no longer yields.
DELETE FROM "public"."circle_participant_cache" pc
WHERE NOT EXISTS (
  SELECT 1
  FROM "public"."circle_participant" p
  WHERE p."circleId" = pc."circleId"
    AND p."memberId" = pc."memberId"
);
