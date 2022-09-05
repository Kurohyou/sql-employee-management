const addQueries = (departmentChoices) => {
  // Checks if the prompt should be used.
  const when = (answers,prop)=> answers.action === 'role:create' || (answers.update && answers.update.indexOf(prop) > -1);
  return [
    {
      when:(answers) => when(answers,'title'),
      type:'input',
      name:'table.title',
      message:'Role title:',
      // Names should be alphanumeric and not be empty
      validate(input){
        return input && !/^[\s\d]+$/.test(input) ?
          true :
          'Titles must not be empty';
      }
    },
    {
      when:(answers) => when(answers,'salary'),
      type:'number',
      name:'table.salary',
      message:'Role salary:',
      // Names should be alphanumeric and not be empty
      validate(input){
        return input ?
          true :
          'Salaries must not be "0"';
      }
    },
    {
      when:(answers) => when(answers,'department_id') && departmentChoices.length,
      type:'list',
      name:'table.department_id',
      message:'Role department:',
      choices:departmentChoices
    }
  ];
};

const updateQueries = (roleChoices) => {
  const when = (answers)=> answers.action === 'role:update';
  return [
    {
      when:(answers)=>when(answers) || answers.action === 'role:remove',
      type:'list',
      name:'id',
      message:(answers)=> `Which role do you want to ${answers.action.replace(/role:/,'')}?`,
      choices:roleChoices
    },
    {
      when,
      type:'checkbox',
      name:'update',
      message:(answers)=>`Which aspects of the role do you want to adjust?`,
      choices:[
        {name:'Title',value:'title'},
        {name:'Salary',value:'salary'},
        {name:'Department',value:'department_id'}
      ],
      validate(input){
        return input.length ?
          true :
          'You must select something to modify';
      }
    }
  ]
};

/**
 * Queries for what employee to add in addition to the name property
 */
export const queries = (departments,roles) => {
  const departmentChoices = departments.map(o => {
    return {name:o.name,value:o.id};
  });
  const roleChoices = roles.map(o => {
    return {name:o.title,value:o.id};
  });
  return [
    ...updateQueries(roleChoices),
    ...addQueries(departmentChoices)
  ]
};