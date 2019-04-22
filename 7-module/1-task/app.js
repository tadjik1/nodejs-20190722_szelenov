const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const uuid = require('uuid/v4');
const Router = require('koa-router');
const passport = require('./libs/passport');

const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = { error: err.message };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
});

const router = new Router({ prefix: '/api' });

router.post('/login', async (ctx, next) => {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;
    
    if (!user) {
      ctx.status = 400;
      ctx.body = { error: info };
      return;
    }
  
    const token = uuid();
    
    ctx.body = { token };
  })(ctx, next);
});

app.use(router.routes());

// this for HTML5 history in browser
const index = fs.readFileSync(path.join(__dirname, 'public/index.html'));
app.use(async (ctx, next) => {
  if (!ctx.url.startsWith('/api')) {
    ctx.set('content-type', 'text/html');
    ctx.body = index;
  }
});

module.exports = app;
