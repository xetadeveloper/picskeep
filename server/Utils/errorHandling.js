import { errorTypes, oldConsole } from '../config.js';

const debugMode = process.env.debguMode === 'debug';

export function serverErrorFound(res, err, errMessage) {
  oldConsole.log('Error occured in server operation: ', err, '\n');
  res.status(500).json({
    app: {
      error: {
        type: errorTypes.servererror,
        message: debugMode ? err.stack : errMessage,
      },
    },
  });
}

export function dbOperationError(res, err, errMessage) {
  oldConsole.log('Error occured in executing DB operation: ', err, '\n');
  res.status(500).json({
    app: {
      error: {
        type: errorTypes.databaseerror,
        message: debugMode ? err.stack : errMessage,
      },
    },
  });
}

export function executionError(res, status, errType, errMessage) {
  oldConsole.log(
    `Error occured in an operation\n Error Message: ${errMessage}`
  );
  res.status(status).json({
    app: {
      error: {
        type: errType,
        message: errMessage,
      },
    },
  });
}

/** Used to tell client that bad input was supplied
 * 
 * Errorfields is an array of the fields that have the bad input
 * An example of the errorFields syntax is 
 * 
 * [
    {
      field: 'username',
      message: `User with username ${username} does not exist`,
    },
    {
      field: 'password',
      message: `User with password ${password} does not exist`,
    },
      ]
 * 
 * An example of using this function is 
 * 
 * badInputError(res, [
    {
      field: 'username',
      message: `User with username ${username} does not exist`,
    },
    {
      field: 'password',
      message: `User with password ${password} does not exist`,
    },
      ]);
 * 
 * @param {Response} res 
 * @param {Array} errorFields 
 * @param {ErrorTypes} errorType 
 * @param {StatusCode} status 
 */
export function badInputError(res, errorFields, errorType, status) {
  oldConsole.log('Client supplied bad input: ', errorFields, '\n');
  res.status(status || 400).json({
    app: {
      error: {
        type: errorType || errorTypes.inputerror,
        errorFields,
      },
    },
  });
}

export function emptyRequestBodyError(res) {
  oldConsole.log('No data found in request body \n');
  const errMessage = 'Required data not found';
  res.status(400).json({
    app: {
      error: {
        type: errorTypes.emptybodyerror,
        message: errMessage,
      },
    },
  });
}

export function emptyRequestQueryError(res) {
  oldConsole.log('No data passed in request query \n');
  const errMessage = 'Required data not found';
  res.status(400).json({
    app: {
      error: {
        type: errorTypes.emptyqueryerror,
        message: errMessage,
      },
    },
  });
}
