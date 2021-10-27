import dotenv from 'dotenv';
dotenv.config();

export const oldConsole = { ...console };
if (process.env.debugMode === 'debug') {
  console.log('In Debug Mode...');
} else {
  console = {};
  console.log = () => {};
}

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
export const debugMode = true;

export const serverErrMsg =
  'Sorry an error occured on the server. Please contact support';

export const dbOpErrorMsg = 'An error occured. Please contact support';

export const saltRounds = 10;
