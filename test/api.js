'use strict';

import app from '../src/index';
let request = require('supertest').agent(app.listen(3000));

describe('Hello world', () => {
  it('should say hello', done => {
    request
      .get('/api')
      .expect(200)
      .expect('Hello world API!', done);
  });
});

describe('create user', () => {
  it('should return a full user list', done => {
    request
      .post('/api/users')
      .send({
        email: 'u3@example.net',
        password: '789'
      })
      .expect(201)
      .expect({
        status: 'ok'
      }, done);
  });
});

describe('create the same user', () => {
  it('should get an error', done => {
    request
      .post('/api/users')
      .send({
        email: 'u3@example.net',
        password: '789'
      })
      .expect(403, done);
  });
});

describe('create invalid user', () => {
  it('should get an error', done => {
    request
      .post('/api/users')
      .send({ email: 'uaaa@', password: '123' })
      .expect(403, done);
  });
});

describe('get the user info', () => {
  it('should get a json', done => {
    request
      .get('/api/user')
      .send({
        email: 'u3@example.net',
        password: '789'
      })
      .expect(200)
      .expect(res => {
        let dateCreated = res.body.dateCreated;
        if (String(Number.parseInt(dateCreated)) === dateCreated) {
          res.body.dateCreated = 'good';
        } else {
          res.body.dateCreated = 'bad';
        }
      })
      .expect({
        email: 'u3@example.net',
        defaultCampus: 'univ',
        dateCreated: 'good'
      }, done);
  });
});

describe('create a post', () => {
  it('should create a new post!', done => {
    request
      .post('/api/posts')
      .send({
        email: 'u3@example.net',
        password: '789',
        postType: 'sell',
        contents: 'selling a thing for good!',
        price: '4532'
      })
      .expect(201)
      .expect({
        status: 'ok',
        post: 'p4'
      }, done);
  });

  it('should return the exact post information', done => {
    request
      .get('/api/posts/p4')
      .expect(200)
      .expect(res => {
        delete res.body.dateCreated;
        delete res.body.dateModified;
      })
      .expect({
        email: 'u3@example.net',
        postType: 'sell',
        //dateCreated: `${Date.now()}`,
        //dateModified: `${Date.now()}`,
        contents: 'selling a thing for good!',
        campusID: 'univ',
        price: {
          price: '4532',
          currency: 'USD',
          factor: 2
        }
      }, done);
  });
});

describe('get a post info', () => {
  it('should get the information of a single post', done => {
    request
      .get('/api/posts/p1')
      .expect(200)
      .expect(res => {
        delete res.body.dateCreated;
        delete res.body.dateModified;
      })
      .expect({
        email: 'u1@example.com',
        postType: 'sell',
        //dateCreated: `${Date.now()}`,
        //dateModified: `${Date.now()}`,
        contents: 'selling a book',
        campusID: 'univ',
        price: {
          price: '1234',
          currency: 'USD',
          factor: 2
        }
      }, done);
  });
});

describe('get the whole post list of user', () => {
  it('should get a posts list', done => {
    request
      .get('/api/posts')
      .send({
        email: 'u1@example.com',
        password: '123'
      })
      .expect(200)
      .expect({
        status: 'ok',
        postsList: ['p1', 'p2']
      }, done);
  });
});


