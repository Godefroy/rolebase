alter table "public"."thread" add column "pinned" boolean
 not null default 'false';
