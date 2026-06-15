-- Denormalize orgId onto circle_member and circle_link so the org subscription
-- can return them as flat top-level arrays (org -> circleMembers / circleLinks).
-- orgId is set at creation time by the app (no trigger).

ALTER TABLE "public"."circle_member" ADD COLUMN "orgId" uuid;
UPDATE "public"."circle_member" cm
  SET "orgId" = c."orgId"
  FROM "public"."circle" c
  WHERE c."id" = cm."circleId";
ALTER TABLE "public"."circle_member" ALTER COLUMN "orgId" SET NOT NULL;
ALTER TABLE "public"."circle_member"
  ADD CONSTRAINT "circle_member_orgId_fkey"
  FOREIGN KEY ("orgId") REFERENCES "public"."org" ("id")
  ON UPDATE restrict ON DELETE cascade;

ALTER TABLE "public"."circle_link" ADD COLUMN "orgId" uuid;
UPDATE "public"."circle_link" cl
  SET "orgId" = c."orgId"
  FROM "public"."circle" c
  WHERE c."id" = cl."parentId";
ALTER TABLE "public"."circle_link" ALTER COLUMN "orgId" SET NOT NULL;
ALTER TABLE "public"."circle_link"
  ADD CONSTRAINT "circle_link_orgId_fkey"
  FOREIGN KEY ("orgId") REFERENCES "public"."org" ("id")
  ON UPDATE restrict ON DELETE cascade;
