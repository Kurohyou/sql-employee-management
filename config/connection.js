import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cTable from 'console.table';
dotenv.config();
export const connection = await mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
);
console.log(`${process.env.DB_NAME} database loaded`);

/**
 * Object holding aliases for common database actions.
 */

// Database Get functions
/**
 * Function to get all rows of a given table
 * @param {string} table - Name of the table to work with
 * @returns {Promise} - Resolves to the database response
 */
function all(table){
  return connection.query(`SELECT * from ??`,table);
};

/**
 * Function to get records that match a search criteria
 * @param {string} table - Name of the table to work with
 * @param {Object} searchObj - Object containing the keys to search:values to search for. Can accept regexp search values.
 * @returns {Promise} - Resolves to the database response
 */
function get(table,searchObj){
  const searchKeys = Object.keys(searchObj);
  const search = searchKeys
    .reduce((memo,col) => {
      if(searchObj[col]){
        memo[col] = searchObj[col];
      }
      return memo;
    },{});
  return connection.query(`SELECT * FROM ?? WHERE ${searchKeys.map(k => {
      return searchObj[k] instanceof RegExp ?
        `(${k} REGEXP ?)`:
        `${k}=?`
    }).join(' AND ')}`,[table,...Object.values(search)]);
};

// Database manipulation functions
/**
 * Function to trigger updates of variable number of properties in a row on a table.
 * @param {string} table - Name of the table to work with
 * @param {string[]} validKeys - Array of columns to set
 * @param {Object} updateObj - Object containing the keys to set:values to set them to
 * @param {string[]} searchKeys - Array of column names to search
 * @param {Object} searchObj - Object containing the keys to search:values to search for
 * @returns {Promise} - Resolves to the database response
 */
async function update(table,validKeys,updateObj,searchObj){
  const search = ['id',...validKeys].filter(k => searchObj[k])
  const setObj = validKeys
    .reduce((memo,col) => {
      if(updateObj[col]){
        memo[col] = updateObj[col];
      }
      return memo;
    },{});
  const preparedArgs = [table,...Object.values(setObj),searchObj.id];
  const [result] = await connection.query(`
    UPDATE ??
    SET ${Object.keys(setObj).map(a => `${a}=?`).join(', ')}
    WHERE ${search.map(a => `${a}=?`).join('AND ')}`,
    preparedArgs);
  // console.table(`Entry on ${table} table updated`,[result]);
};

async function create(table,setKeys,setObj){
  const values = setKeys
    .reduce((memo,col) => {
      if(setObj[col]){
        memo.push(setObj[col]);
      }else{
        memo.push('NULL');
      }
      return memo;
    },[]);
  const [result] = await connection.query(`
  INSERT INTO ?? (${setKeys.join(', ')})
  VALUES
    (${setKeys.map(k => '?').join(', ')})`,[table,...values]);
  return result;
};

/**
 * Shows the data in the console.
 * @param {string} header - The header to use for the table
 * @param {Object[]} data - Array of objects describing the cells to display
 */
function show(header,data){
  console.table(`\n${header}`,data);
}

function remove(table,id){
  return connection.query('DELETE FROM ?? WHERE id=?',[table,id]);
}

export const db = {all,get,update,create,query:connection.query,show,remove};