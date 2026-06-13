ALTER TABLE "public"."org" DROP CONSTRAINT "org_iconFileId_fkey";

ALTER TABLE "public"."org"
  DROP COLUMN "icon",
  DROP COLUMN "iconFileId",
  DROP COLUMN "homeNote";
