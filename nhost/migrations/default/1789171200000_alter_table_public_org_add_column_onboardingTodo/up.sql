ALTER TABLE "public"."org"
  ADD COLUMN "onboardingTodo" text NULL
  CONSTRAINT "org_onboardingTodo_check" CHECK ("onboardingTodo" IN ('completed', 'dismissed'));

-- Existing organizations never show the onboarding todo
UPDATE "public"."org" SET "onboardingTodo" = 'completed';
