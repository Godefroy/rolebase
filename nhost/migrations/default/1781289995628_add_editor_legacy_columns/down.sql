ALTER TABLE "public"."role"
  DROP COLUMN "purpose_legacy",
  DROP COLUMN "domain_legacy",
  DROP COLUMN "accountabilities_legacy",
  DROP COLUMN "checklist_legacy",
  DROP COLUMN "indicators_legacy",
  DROP COLUMN "notes_legacy";
ALTER TABLE "public"."decision" DROP COLUMN "description_legacy";
ALTER TABLE "public"."task" DROP COLUMN "description_legacy";
ALTER TABLE "public"."member" DROP COLUMN "description_legacy";
ALTER TABLE "public"."meeting" DROP COLUMN "summary_legacy";
ALTER TABLE "public"."meeting_step" DROP COLUMN "notes_legacy";
ALTER TABLE "public"."thread_activity" DROP COLUMN "data_legacy";
ALTER TABLE "public"."log" DROP COLUMN "changes_legacy";
