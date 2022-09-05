INSERT INTO department (name)
VALUES 
  ("R&D"),
  ("Marketing");
       
INSERT INTO role (title,salary,department_id)
VALUES
  ('Science Intern',10,1),
  ('Research Lead',100000,1),
  ('Graphic Designer',40000,2),
  ('Copywriter',35000,2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES
  ('Jane','Doe',2,NULL),
  ('John','Doe',1,1),
  ('Cynthia','Sweet',3,NULL),
  ('John','Smith',4,3);