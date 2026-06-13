ALTER TABLE "public"."org"
  ADD COLUMN "icon" text,
  ADD COLUMN "iconFileId" uuid,
  ADD COLUMN "homeNote" text;

ALTER TABLE "public"."org"
  ADD CONSTRAINT "org_iconFileId_fkey"
  FOREIGN KEY ("iconFileId")
  REFERENCES "storage"."files" ("id")
  ON UPDATE RESTRICT ON DELETE RESTRICT;
