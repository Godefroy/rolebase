alter table "public"."log" add column "threadId" uuid;
alter table "public"."log"
  add constraint "log_threadId_fkey"
  foreign key ("threadId")
  references "public"."thread"
  ("id") on update restrict on delete restrict;
alter table "public"."log" add column "taskId" uuid;
alter table "public"."log"
  add constraint "log_taskId_fkey"
  foreign key ("taskId")
  references "public"."task"
  ("id") on update restrict on delete restrict;
