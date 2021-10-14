/**Checks if user is logged in */
export function isLoggedIn(req, res, next) {
  console.log('Req Session UserID: ', req.session.userID);
  if (req.session.userID) {
    console.log('user is logged in');
    next();
  } else {
    console.log('user is not logged in');
    res.status(401).json({ app: { isLoggedIn: false } });
  }
}
