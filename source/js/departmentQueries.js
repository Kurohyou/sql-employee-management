/**
 * Creates the update queries.
 */
const updateQueries = (departments) => {
  const when = (answers) => answers.action === 'department:update';
  
  return [{
    when,
    type:'list',
    name:'id',
    message:'Update which department:',
    choices:departments.map(o => {
        return {name:o.name,value:o.id}
      })
  }]
};

/**
 * Constructs the queries for the report options.
 * @returns {Object[]}
 */
const reportQueries = (departments) => {
  const when = (answers) => answers.action === 'department:report';
  return [
    {
      when,
      type:'list',
      name:'table.report',
      message:'What Department report do you want to run',
      choices:[
        {name:'Expenses',value:'expense'},
        {name:'View all',value:'all'}
      ]
    },
    {
      when:(answers) => answers.table?.report === 'expense',
      type:'list',
      name:'table.details',
      message:'Report on:',
      choices:departments.map(o => {
          return {name:o.name,value:o.id}
        })
    }
  ]
};

/**
 * Queries for what department to add.
 */
export const queries = (departments)=> [
  ...updateQueries(departments),
  {
    when:(answers)=> /department:(?:create|update)/.test(answers.action),
    type:'input',
    name:'table.name',
    message:'Department name',
    // DepartmentNames should not be all numbers or empty
    validate(input){
      return input !== '' && 
        !/^\d+$/.test(input) &&
        departments.every(o => o.name !== input) ?
          true :
          'Department names must not be empty and must be unique.';
    }
  },
  {
    when:(answers)=>answers.action === 'department:remove',
    type:'list',
    name:'id',
    message:(answers)=> `Which Department do you want to remove?`,
    choices:departments.map(o => {
        return {name:o.name,value:o.id}
      })
  },
  ...reportQueries(departments)
];