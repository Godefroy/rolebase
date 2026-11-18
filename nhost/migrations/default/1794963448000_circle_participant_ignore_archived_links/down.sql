CREATE OR REPLACE VIEW "public"."circle_participant" AS
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
