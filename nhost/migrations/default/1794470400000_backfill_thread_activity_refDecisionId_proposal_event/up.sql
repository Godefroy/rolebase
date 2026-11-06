-- Link resolved proposals to the decision they created
UPDATE thread_activity ta
SET "refDecisionId" = (data->>'decisionId')::uuid
WHERE ta.type = 'ProposalEvent'
    AND ta."refDecisionId" IS NULL
    AND ta.data->>'decisionId' IS NOT NULL
    AND EXISTS (
       SELECT 1 FROM decision WHERE id = (ta.data->>'decisionId')::uuid
    );
