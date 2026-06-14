alter table "public"."circle_link"
  add constraint "circle_link_parentId_circleId_key" unique ("parentId", "circleId");
