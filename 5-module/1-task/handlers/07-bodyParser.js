const bodyParser = require('koa-bodyparser');

// ctx.request.body = {name: '', password: '', ...}

module.exports = {
  init: function(app) {
    app.use(bodyParser({
      jsonLimit: '56kb',
    }));
  },
};
