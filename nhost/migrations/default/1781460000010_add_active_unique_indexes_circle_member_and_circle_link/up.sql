-- Enforce uniqueness of active (non-archived) memberships and links at the DB
-- level. This covers inserts, un-archiving updates, and admin/backend writes
-- that bypass Hasura permission checks.
--
-- Note: if rows already violate these constraints (duplicate active membership
-- or duplicate active link), archive the extra rows before applying.

CREATE UNIQUE INDEX "circle_member_active_unique"
  ON "public"."circle_member" ("circleId", "memberId")
  WHERE "archived" = false;

CREATE UNIQUE INDEX "circle_link_active_unique"
  ON "public"."circle_link" ("parentId", "circleId")
  WHERE "archived" = false;
