import { debugMode, errorTypes } from '../config.js';

export function serverErrorFound(res, err, errMessage) {
  console.log('Error occured in server operation: ', err);
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
  console.log('Error occured in executing DB operation: ', err);
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
  console.log('Error occured in an operation');
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
  console.log('Client supplied bad input: ', errorFields);
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
  console.log('No data found in request body');
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
  console.log('No data passed in request query');
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
