'use strict';

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
const mount = require('koa-mount');
const logger = require('koa-logger');
const serve = require('koa-static');
const path = require('path');

import User from './models/users';
import Post from './models/posts';

const app = new Koa();

const routerApi = new Router();
routerApi
  .get('/', async (ctx, next) => {
    ctx.body = 'Hello world API!';
  })
  .post('/users', async (ctx, next) => {
    let userInfo = ctx.request.body;
    userInfo.campusID = userInfo.campusID || 'univ';
    User
      .createUser({
        email: userInfo.email,
        password: userInfo.password,
        campusID: userInfo.campusID
      }).then(usersDB => {
        console.log(usersDB);
        ctx.status = 201;
        ctx.body = {
          'status': 'ok'
        };
      }).catch(error => {
        ctx.status = 403;
        ctx.body = {
          'status': 'error'
        }
        console.log(error);
      });
  })
  .get('/user', async (ctx, next) => {
    let userInfo = ctx.request.body;
    let email = userInfo.email;
    User.fromEmail(email).then(user => {
      ctx.body = user.getInfo();
      //console.log(user.getInfo(true)); // debug only
    }).catch(error => {
      console.log(error);
    });
  })
  .post('/posts', async (ctx, next) => {
    let reqInfo = ctx.request.body;
    let email = reqInfo.email;
    let password = reqInfo.password;
    let postType = reqInfo.postType;
    let contents = reqInfo.contents;
    let price = reqInfo.price;
    User.fromEmail(email)
      .then(user => {
        return Post.createPost({
          userID: user.userID,
          postType: postType,
          contents: contents,
          price: price
        });
      }).then(postID => {
        ctx.status = 201;
        ctx.body = {
          status: 'ok',
          post: postID
        };
      }).catch(error => {
        console.log(error);
      });
  })
  .get('/posts', async (ctx, next) => {
    let reqInfo = ctx.request.body;
    let email = reqInfo.email;
    let password = reqInfo.password;
    User.fromEmail(email)
      .then(user => {
        return Post.getPostsListOfUser(user.userID);
      }).then(postsList => {
        ctx.body = {
          status: 'ok',
          postsList: postsList
        };
      }).catch(error => {
        console.log(error);
      });
  })
  .get('/posts/:postID', async (ctx, next) => {
    Post.fromID(ctx.params.postID).then(post => {
      ctx.body = post.getInfo();
    }).catch(error => {
      console.log(error);
    });
  });


app
  .use(logger())
  .use(bodyParser())
  .use(mount('/api', routerApi.routes()))
  .use(mount('/', serve(path.join(__dirname, './public/'))));


if (!module.parent) {
  app.listen(3000, () => {
    console.log('starting app');
  });
}
export default app;
