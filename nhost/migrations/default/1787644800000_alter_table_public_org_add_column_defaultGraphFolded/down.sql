update "public"."org" set "defaultGraphView" = case
  when "defaultGraphView" = 'Circles' and "defaultGraphFolded" then 'SimpleCircles'
  when "defaultGraphView" = 'Circles' then 'AllCircles'
  when "defaultGraphView" = 'Tree' and "defaultGraphFolded" then 'HierarchySimple'
  when "defaultGraphView" = 'Tree' then 'HierarchyAll'
  else "defaultGraphView"
end;

alter table "public"."org" drop column "defaultGraphFolded";
