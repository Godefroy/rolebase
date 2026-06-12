-- Backup columns for the editor content migration (Lexical JSON -> markdown).
-- The migration script copies the original JSON value into these columns
-- just before replacing it with markdown, so the conversion can be re-run.
ALTER TABLE "public"."role"
  ADD COLUMN "purpose_legacy" text,
  ADD COLUMN "domain_legacy" text,
  ADD COLUMN "accountabilities_legacy" text,
  ADD COLUMN "checklist_legacy" text,
  ADD COLUMN "indicators_legacy" text,
  ADD COLUMN "notes_legacy" text;
ALTER TABLE "public"."decision" ADD COLUMN "description_legacy" text;
ALTER TABLE "public"."task" ADD COLUMN "description_legacy" text;
ALTER TABLE "public"."member" ADD COLUMN "description_legacy" text;
ALTER TABLE "public"."meeting" ADD COLUMN "summary_legacy" text;
ALTER TABLE "public"."meeting_step" ADD COLUMN "notes_legacy" text;
ALTER TABLE "public"."thread_activity" ADD COLUMN "data_legacy" json;
ALTER TABLE "public"."log" ADD COLUMN "changes_legacy" json;
