CREATE TABLE governance_mode (
  value text PRIMARY KEY,
  comment text
);

INSERT INTO governance_mode (value, comment) VALUES
('Free', 'All members can edit the whole org chart'),
('Agile', 'Roles can be edited by their leaders'),
('Strict', 'Roles can only be changed through proposals (Holacracy)');
