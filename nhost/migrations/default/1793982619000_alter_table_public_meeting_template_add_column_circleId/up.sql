alter table "public"."meeting_template"
  add column "circleId" uuid null;

alter table "public"."meeting_template"
  add constraint "meeting_template_circleId_fkey"
  foreign key ("circleId")
  references "public"."circle"
  ("id") on update restrict on delete set null;

CREATE INDEX "meeting_template_circleId_key" on
  "public"."meeting_template" using btree ("circleId");
