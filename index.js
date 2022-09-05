import { Company } from './models/models.js';
import { connection } from './config/connection.js';
import * as query from './source/js/queries.js';

const ask = async ()=>{
  const results = await query.send();
  const match = results.action.match(/(.+?)(?::(.+))?$/)?.slice(1) || [];
  const [table,action = 'report'] = match;
  if(table === 'Quit'){
    console.log('Have a good day!');
    connection.end();
    return;
  }
  Company[table][action](results.table,{id:results.id});
  ask();
};

ask();