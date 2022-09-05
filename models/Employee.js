import { connection, db } from '../config/connection.js';

export const all = ()=>
  db.all('employee');

export const get = (updateObj,searchObj) =>
  db.get('employee',searchObj);

export const update = (updateObj,searchObj) => {
  return db.update('employee',['first_name','last_name','role_id','manager_id'],updateObj,searchObj)
};

export const create = (setObj) =>
  db.create('employee',['first_name','last_name','role_id','manager_id'],setObj);

export const remove = (setObj,searchObj) =>
  db.remove('employee',searchObj.id);

const department = (departmentID) => {
  return connection.query(`
  SELECT
    department.name AS department,
    CONCAT(e.last_name,', ',e.first_name) AS name,
    e.id AS eid,
    role.title,
    CONCAT('$',role.salary) AS salary
  FROM employee e
    LEFT OUTER JOIN employee m
      ON m.id = e.manager_id
    LEFT OUTER JOIN role
      ON role.id = e.role_id
    LEFT OUTER JOIN department
      ON department.id = role.department_id
  WHERE role.department_id = ?;
  `,[departmentID])
};

const manager = (managerID) => {
  return connection.query(`
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
  WHERE m.id = ?;
  `,[managerID])
};

const employeeSummary = () => {
  return connection.query(`
  SELECT
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
      ON department.id = role.department_id`);
};

export const report = async (tableObj) =>{
  const reportTypes = {department,manager,all:employeeSummary};
  const [result] = await reportTypes[tableObj.report](tableObj.details);
  db.show(`Employees - ${tableObj.report === 'all' ? '' : 'by '}${tableObj.report}`,result);
};