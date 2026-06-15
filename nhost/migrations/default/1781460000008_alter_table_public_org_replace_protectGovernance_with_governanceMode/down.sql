ALTER TABLE "public"."org"
  ADD COLUMN "protectGovernance" boolean NOT NULL DEFAULT false;

UPDATE "public"."org"
  SET "protectGovernance" = ("governanceMode" <> 'Free');

ALTER TABLE "public"."org" DROP CONSTRAINT "org_governanceMode_fkey";
ALTER TABLE "public"."org" DROP COLUMN "governanceMode";
