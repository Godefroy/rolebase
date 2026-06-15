ALTER TABLE "public"."org"
  ADD COLUMN "governanceMode" text NOT NULL DEFAULT 'Free';

UPDATE "public"."org"
  SET "governanceMode" = CASE WHEN "protectGovernance" THEN 'Agile' ELSE 'Free' END;

ALTER TABLE "public"."org"
  ADD CONSTRAINT "org_governanceMode_fkey"
  FOREIGN KEY ("governanceMode")
  REFERENCES "public"."governance_mode" ("value")
  ON UPDATE restrict ON DELETE restrict;

ALTER TABLE "public"."org" DROP COLUMN "protectGovernance";
