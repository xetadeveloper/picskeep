import dotenv from 'dotenv';
dotenv.config()

export const errorTypes = {
  servererror: 'servererror',
  databaseerror: 'databaseerror',
  updateerror: 'updateerror',
  deleteerror: 'deleteerror',
  notfounderror: 'notfounderror',
  inserterror: 'inserterror',
  emptybodyerror: 'emptybodyerror',
  emptyqueryerror: 'emptyqueryerror',
  duplicateusererror: 'duplicateusererror',
  inputerror: 'inputerror',
};

export const appMode = 'dev';
