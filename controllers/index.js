const {
  renderPage
} = require('../utils/render-page');

const home = (req, res) => {
  const data = {
    message: 'This is a General Home Page',
    firstName: 'John',
    lastName: 'Doe',
    pageName: 'Home',
    path: 'home'
  };

  return renderPage(res, 'pages/contactUs', data, 'Demo Page');
};

const profile = (req, res) => {

  const user = req.session.user;
  const userPosts = []
  console.log(user)

  return renderPage(res, 'pages/userDashboard', {
    user,
    userPosts
  }, 'Demo Page', '/profile');
};

const terms = (req, res) => {
  return renderPage(res, 'pages/termsConditions', {} , 'Terms and Condition', '/terms');
}

const contactUs = (req, res) => {
  return renderPage(res, 'pages/contactUs', {} , 'Contact Us', '/contactUs');
}



module.exports = {
  home,
  profile,
  terms,
  contactUs
};