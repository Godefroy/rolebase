-- Remove unused source columns on log: taskId and threadId were never
-- populated (logs only ever reference meetingId or decisionId). The dead
-- thread "ChangeStatus" activities synthesized from log.threadId are
-- removed along with this.
alter table "public"."log" drop column "taskId" cascade;
alter table "public"."log" drop column "threadId" cascade;
