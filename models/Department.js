import { db,connection } from '../config/connection.js';

export const all = ()=> db.all('department');

export const get = (searchObj) => db.get('department',searchObj);

export const update = (updateObj,searchObj) =>
  db.update('department',['name'],updateObj,searchObj);

export const create = (setObj) => db.create('department',['name'],setObj);

export const remove = (setObj,searchObj) =>
  db.remove('department',searchObj.id);

const expense = (departmentID) => {
  return connection.query(`
  SELECT
    department.id,
    department.name,
    CONCAT('$',SUM(role.salary)) AS total
  FROM department
  LEFT OUTER JOIN role
    ON role.department_id = department.id
  LEFT OUTER JOIN employee
    ON role.id = employee.role_id
  WHERE department.id = ?
  `,departmentID);
};

export const report = async (tableObj) =>{
  const reportTypes = {all,expense};
  const [result] = await reportTypes[tableObj.report](tableObj.details)
  db.show(`Departments - ${tableObj.report}`,result);
};