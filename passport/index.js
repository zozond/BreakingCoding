const passport = require('passport');
const local = require('./localStrategy');
const kakao = require("./kakao");
const naver = require("./naver");
// const google = require("./google");

const User = require('../models/users');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser((userId, done) => {
    User.findOne({
      where: { userId }
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
  kakao();
  naver();
  // google();
};
