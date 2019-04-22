const Koa = require('koa');
const Router = require('koa-router');

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

const router = new Router();

router.get('/users', async (ctx) => {

});

router.get('/users/:id', async (ctx) => {

});

router.patch('/users/:id', async (ctx) => {

});

router.post('/users', async (ctx) => {

});

router.delete('/users/:id', async (ctx) => {

});

app.use(router.routes());

module.exports = app;
