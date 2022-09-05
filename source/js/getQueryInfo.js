import { Company } from '../../models/models.js';

/**
 * Gets all available departments, managers, and roles. Returns them as an object that can be destructured.
 */
export const getAvailable = async ()=>{
  const [department] = await Company.department.all();
  const [employee] = await Company.employee.all();
  const [role] = await Company.role.all();
  return [department,employee,role];
}