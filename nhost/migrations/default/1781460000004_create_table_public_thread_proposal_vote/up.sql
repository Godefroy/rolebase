CREATE TABLE "public"."thread_proposal_vote" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "activityId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "vote" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("activityId") REFERENCES "public"."thread_activity" ("id") ON UPDATE restrict ON DELETE cascade,
  FOREIGN KEY ("userId") REFERENCES "auth"."users" ("id") ON UPDATE restrict ON DELETE cascade,
  UNIQUE ("activityId", "userId")
);
