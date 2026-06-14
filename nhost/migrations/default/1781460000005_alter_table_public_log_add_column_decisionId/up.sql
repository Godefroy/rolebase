alter table "public"."log" add column "decisionId" uuid null;
alter table "public"."log"
  add constraint "log_decisionId_fkey" foreign key ("decisionId")
  references "public"."decision" ("id") on update restrict on delete set null;
