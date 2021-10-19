export function getErrorObject(errMsg, statusCode = 500, resStatus, err) {
  console.log(`Error: ${errMsg}\n`, err);
  return {
    statusCode,
    message: `Error occured: ${errMsg}\nOperation returned httpStatusCode ${resStatus}\nError: ${err}`,
  };
}

export function badResponse(errMsg, statusCode = 500, resStatus) {
  console.log(`Error: ${errMsg}`);
  return {
    statusCode,
    message: `Unexpected response: ${errMsg}\nOperation returned httpStatusCode ${resStatus}`,
  };
}

export function noCodeBadResponse(errMsg, statusCode = 500) {
  console.log(`Error: ${errMsg}`);
  return {
    statusCode,
    message: `Unexpected response: ${errMsg}`,
  };
}
