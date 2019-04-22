const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false, },
  function(email, password, done) {
    done(null, false, 'Стратегия подключена, но еще не настроена');
  }
);
