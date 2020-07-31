/* eslint-disable consistent-return */
const checkNotLoggedIn = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
}

const checkLoggedIn = (req, res, next) => {
  const { isLoggedIn } = req.session;

  if (req.session) {
    if (isLoggedIn) res.redirect('/');



    return next();
  }
}

const authorizeAdmin = (req, res, next) => {
  const { user, isLoggedIn } = req.session;
  if(user && isLoggedIn && user.role === 'admin') {
    return next();
  }
  return res.redirect('/posts');
}

module.exports = { checkLoggedIn, checkNotLoggedIn, authorizeAdmin }