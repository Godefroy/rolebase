-- Speed up reverse lookups of the thread that references a decision
-- (DecisionContent: thread_activity where refDecisionId = $decisionId).
CREATE INDEX "thread_activity_refDecisionId_idx"
  ON thread_activity ("refDecisionId")
  WHERE "refDecisionId" IS NOT NULL;
