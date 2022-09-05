const addQueries = (employeeChoices,roleChoices) => {
  // Checks if the prompt should be used.
  const when = (answers,prop)=> answers.action === 'employee:create' || (answers.update && answers.update.indexOf(prop) > -1);
  return [
    {
      when:(answers) => when(answers,'first_name'),
      type:'input',
      name:'table.first_name',
      message:'Employee first name',
      // Names should be alphanumeric and not be empty
      validate(input){
        return input && !/^[\s\d]+$/.test(input) ?
          true :
          'Names must not be empty';
      }
    },
    {
      when:(answers) => when(answers,'last_name'),
      type:'input',
      name:'table.last_name',
      message:'Employee last name',
      // Names should be alphanumeric and not be empty
      validate(input){
        return input && !/^[\s\d]+$/.test(input) ?
          true :
          'Names must not be empty';
      }
    },
    {
      when:(answers) => when(answers,'role_id'),
      type:'list',
      name:'table.role_id',
      message:'What is the employee\'s role?',
      choices:roleChoices
    },
    {
      when:(answers) => when(answers,'manager_id'),
      type:'list',
      name:'table.manager_id',
      message:"Who is the employee's manager?",
      choices:(answers)=>[{name:'No Manager',id:null},...employeeChoices]
        // Don't allow the employee to be their own manager
        .filter(o => o.value !== answers.id)
    }
  ];
};

const updateQueries = (employeeChoices) => {
  const when = (answers)=> answers.action === 'employee:update';
  return [
    {
      when:(answers)=>when(answers) || answers.action === 'employee:remove',
      type:'list',
      name:'id',
      message:(answers)=> `Which Employee do you want to ${answers.action.replace(/employee:/,'')}?`,
      choices:employeeChoices
    },
    {
      when,
      type:'checkbox',
      name:'update',
      message:'Update (Select all that apply)',
      choices:[
        {name:'First Name',value:'first_name'},
        {name:'Last Name',value:'last_name'},
        {name:'Role',value:'role_id'},
        {name:'Manager',value:'manager_id'}
      ],
      validate(input){
        return input.length ?
          true :
          'You must select something to modify';
      }
    }
  ]
};

const reportQueries = (employeeChoices,departmentChoices) => {
  const when = (answers) => answers.action === 'employee:report';
  return [
    {
      when,
      type:'list',
      name:'table.report',
      message:'What Employee report do you want to run',
      choices:[
        {name:'View all',value:'all'},
        {name:'By Manager',value:'manager'},
        {name:'By Department',value:'department'}
      ]
    },
    {
      when:(answers) => when(answers) && answers.table.report === 'manager',
      type:'list',
      name:'table.details',
      message:`Which manager do you want to see a report for?`,
      choices:(answers)=>[{first_name:'No',last_name:'Manager',id:null},...employeeChoices]
        // Don't allow the employee to be their own manager
        .filter(o => o.value !== answers.id)
    },
    {
      when:(answers) => when(answers) && answers.table.report === 'department',
      type:'list',
      name:'table.details',
      message:`Which department do you want to see a report for?`,
      choices:departmentChoices
    }
  ]
};

/**
 * Queries for what employee to add in addition to the name property
 */
export const queries = (employees,roles,departments) => {
  const employeeChoices = employees.map(o =>{
      return {name:`${o.first_name} ${o.last_name} (${roles.find(r => r.id === o.role_id)?.title || 'No Title'})`,value:o.id};
    });
  const roleChoices = roles.map(o => {
    return {name:o.title,value:o.id};
  });
  const departmentChoices = departments.map(o => {
    return {name:o.name,value:o.id};
  });
  return [
    ...reportQueries(employeeChoices,departmentChoices),
    ...updateQueries(employeeChoices),
    ...addQueries(employeeChoices,roleChoices)
  ]
};