import inquirer from 'inquirer';
import { getAvailable } from "./getQueryInfo.js";
import { queries as departmentQueries } from './departmentQueries.js';
import { queries as employeeQueries } from './employeeQueries.js';
import { queries as roleQueries } from './roleQueries.js';

const prompt = inquirer.prompt;

export const send = async () => {
  const [ departments, employees, roles ] = await getAvailable();

  const questions = [
    {
      type:'list',
      name:'action',
      message:'What would you like to do?',
      choices:[
        // List of options for the user to select. The values are in the format TABLE:ACTION. Action can be omitted to simply display the table
        {name:'Add a Department',value:'department:create'},
        {name:'Delete a Department',value:'department:remove'},
        {name:'Update a Department',value:'department:update'},
        {name:'Create Department Report',value:'department:report'},

        {name:'Add a Role',value:'role:create'},
        {name:'Delete a Role',value:'role:remove'},
        {name:'Update a Role',value:'role:update'},
        {name:'Create Role Report',value:'role:report'},

        {name:'Add an Employee',value:'employee:create'},
        {name:'Delete an Employee',value:'employee:remove'},
        {name:'Update an Employee',value:'employee:update'},
        {name:'Create Employee Report',value:'employee:report'},

        {name:'Quit'}
      ]
    },
    // Functions that construct the queries for the specific queries
    ...departmentQueries(departments),
    ...roleQueries(departments,roles),
    ...employeeQueries(employees,roles,departments)
  ];
  return prompt(questions);
}