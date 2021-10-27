import { dbOpErrorMsg, errorTypes, serverErrMsg } from '../config.js';
import {
  dbOperationError,
  emptyRequestBodyError,
  executionError,
  serverErrorFound,
} from '../Utils/errorHandling.js';

/**Checks if user is logged in
 * @param {Request} req
 * @param {Response} res
 * @param {Next Middleware} next
 */
export function isLoggedInAPI(req, res, next) {
  // console.log('Req Session UserID: ', req.session.userID);
  if (req.session.userID) {
    // console.log('user is logged in');
    next();
  } else {
    // console.log('user is not logged in');
    res.status(401).json({ app: { isLoggedIn: false } });
  }
}

/**Checks if user is logged in then redirects to login if not
 * @param {Request} req
 * @param {Response} res
 * @param {Next Middleware} next
 */
export function isLoggedInRedirect(req, res, next) {
  // console.log('Req Session UserID: ', req.session.userID);
  if (req.session.userID) {
    console.log('user is logged in');
    next();
  } else {
    // console.log('user is not logged in');
    res.redirect('/login');
  }
}

/** Checks if the route has data passed in
 * @param {Request} req
 * @param {Response} res
 * @param {Next Middleware} next
 */
export function hasData(req, res, next) {
  const { data } = req.body;
  console.log('Reques body: ', req.body);
  // console.log('Data: ', data);

  if (!data || !Object.entries(data).length) {
    emptyRequestBodyError(res);
  } else {
    next();
  }
}

export async function getInfoMiddleware(req, res, next) {
  try {
    const { userID } = req.session;

    console.log('Getting user info...', userID);

    const db = await getDBInstance();
    const users = db.collection('users');

    try {
      const foundUser = await users.findOne(
        { _id: userID },
        { projection: { password: 0 } }
      );

      // console.log('Found User: ', foundUser);

      if (foundUser) {
        res.status(200).json({
          app: { userInfo: foundUser },
        });
      } else {
        executionError(
          res,
          401,
          errorTypes.notfounderror,
          'Could not find user info in DB. Contact Support'
        );
      }
    } catch (err) {
      dbOperationError(res, err, dbOpErrorMsg);
    }
  } catch (err) {
    serverErrorFound(res, err, serverErrMsg);
  }
}
