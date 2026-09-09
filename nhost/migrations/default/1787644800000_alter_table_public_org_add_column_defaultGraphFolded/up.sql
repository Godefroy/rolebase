alter table "public"."org"
  add column "defaultGraphFolded" boolean not null default false;

-- Folding used to be baked into the view name
update "public"."org"
  set "defaultGraphFolded" = true
  where "defaultGraphView" in ('SimpleCircles', 'HierarchySimple');

update "public"."org" set "defaultGraphView" = case "defaultGraphView"
  when 'AllCircles' then 'Circles'
  when 'SimpleCircles' then 'Circles'
  -- The operational view is gone: its orgs fall back to the circles view
  when 'FlatCircle' then 'Circles'
  when 'HierarchyAll' then 'Tree'
  when 'HierarchySimple' then 'Tree'
  else "defaultGraphView"
end;
