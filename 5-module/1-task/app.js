const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const clients = new Set();
router.get('/subscribe', async (ctx, next) => {
  const msg = await new Promise(resolve => {
    clients.add(resolve);
  });
  ctx.body = msg;
});

router.post('/publish', async (ctx, next) => {
  if (!ctx.request.body.message) ctx.throw(400);
  clients.forEach(client => client(ctx.request.body.message));
  clients.clear();
  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
