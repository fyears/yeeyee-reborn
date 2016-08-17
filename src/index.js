'use strict';

import Koa from 'koa';
import Router from 'koa-router';

import User from './models/users';
import Post from './models/posts';

const app = new Koa();
const api_router = new Router({
  prefix: '/api'
});
const logger = require('koa-logger');

api_router
  .get('/', async (ctx, next) => {
    ctx.body = 'Hello world API!';
  })
  .get('/users', async (ctx, next) => {
    ctx.body = 'user!';
  })
  .get('/users/:user_id', async (ctx, next) => {
    User.from_id(ctx.params.user_id).then(user => {
      ctx.body = user.get_info();
    });
  })
  .get('/users/email/:email', async (ctx, next) => {
    User.from_email(ctx.params.email).then(user => {
      ctx.body = user.get_info();
    }).catch(error => {
      console.log(error.toString());
    });
  })
  .get('/posts/:post_id', async (ctx, next) => {
    Post.from_id(ctx.params.post_id).then(post => {
      ctx.body = post.get_info();
    }).catch(error => {
      console.log(error.toString());
    });
  });

app
  .use(logger())
  .use(api_router.routes())
  .use(api_router.allowedMethods());


if (!module.parent) {
  app.listen(3000, () => {
    console.log('starting app');
  });
}
export default app;
