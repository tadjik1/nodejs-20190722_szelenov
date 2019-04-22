const path = require('path');

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  port: 3000,
  secret: 'mysecret',
  root: process.cwd(),
  templatesRoot: path.join(process.cwd(), 'templates'),
};
