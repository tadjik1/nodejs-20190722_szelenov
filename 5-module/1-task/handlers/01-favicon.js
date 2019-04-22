const favicon = require('koa-favicon');

exports.init = (app) => app.use(favicon('public/favicon.ico'));
