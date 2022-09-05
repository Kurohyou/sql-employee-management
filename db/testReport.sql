/* SELECT
  e.id AS eid,
  CONCAT(e.last_name,', ',e.first_name) AS name,
  role.title,
  department.name AS department,
  CONCAT('$',role.salary) AS salary,
  CONCAT(m.last_name,', ',m.first_name) AS manager
FROM employee e
  LEFT OUTER JOIN employee m
    ON m.id = e.manager_id
  LEFT OUTER JOIN role
    ON role.id = e.role_id
  LEFT OUTER JOIN department
    ON department.id = role.department_id;


SELECT
  department.id,
  department.name,
  CONCAT('$',SUM(role.salary)) AS total
FROM department
LEFT OUTER JOIN role
  ON role.department_id = department.id
LEFT OUTER JOIN employee
  ON role.id = employee.role_id
WHERE department.id = 2; */
SELECT
    CONCAT(m.last_name,', ',m.first_name) AS manager,
    CONCAT(e.last_name,', ',e.first_name) AS name,
    e.id AS eid,
    role.title,
    CONCAT('$',role.salary) AS salary,
    department.name AS department
  FROM employee e
    LEFT OUTER JOIN employee m
      ON m.id = e.manager_id
    LEFT OUTER JOIN role
      ON role.id = e.role_id
    LEFT OUTER JOIN department
      ON department.id = role.department_id
  WHERE e.manager_id = 1;