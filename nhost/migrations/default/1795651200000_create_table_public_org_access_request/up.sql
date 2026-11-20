-- Requests to join an org, sent from the onboarding by people whose colleagues
-- (same company email domain) are members. Admins accept or refuse them.
CREATE TABLE "public"."org_access_request" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "orgId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "status" text NOT NULL DEFAULT 'Pending',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "decidedAt" timestamptz,
  "decidedByMemberId" uuid,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("orgId") REFERENCES "public"."org"("id") ON UPDATE restrict ON DELETE cascade,
  FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON UPDATE restrict ON DELETE cascade,
  FOREIGN KEY ("decidedByMemberId") REFERENCES "public"."member"("id") ON UPDATE restrict ON DELETE set null,
  CONSTRAINT "org_access_request_status_check" CHECK ("status" IN ('Pending', 'Accepted', 'Refused'))
);

CREATE INDEX "org_access_request_orgId_key" ON "public"."org_access_request" ("orgId");
CREATE INDEX "org_access_request_userId_key" ON "public"."org_access_request" ("userId");
-- One pending request per person and org
CREATE UNIQUE INDEX "org_access_request_pending_key" ON "public"."org_access_request" ("orgId", "userId") WHERE "status" = 'Pending';
