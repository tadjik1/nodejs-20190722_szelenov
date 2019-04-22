const passport = require('koa-passport');

const localStrategy = require('./strategies/local');

passport.use(localStrategy);

module.exports = passport;
