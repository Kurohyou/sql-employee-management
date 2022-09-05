import { connection, db } from '../config/connection.js';

export const all = ()=> db.all('role');

export const get = (searchObj) => db.get('role',searchObj);

export const update = (updateObj,searchObj) =>{
  return db.update('role',['title','salary','department_id'],updateObj,searchObj)
};

export const create = (setObj) => db.create('role',['title','salary','department_id'],setObj);

export const remove = (setObj,searchObj) =>
  db.remove('role',searchObj.id);

export const report = async () =>{
  const [data] = await connection.query(`
  SELECT role.id,role.title,role.salary,department.name AS department
  FROM role
  JOIN department
    ON department.id = role.department_id
  `);
  db.show(`Roles - all`,data);
}