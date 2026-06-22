-- Speed up reverse lookups of the threads that reference a task
-- (TaskContent: thread_activity where refTaskId = $taskId).
CREATE INDEX "thread_activity_refTaskId_idx"
  ON thread_activity ("refTaskId")
  WHERE "refTaskId" IS NOT NULL;
