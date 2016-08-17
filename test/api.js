'use strict';

import app from '../src/index'
let request = require('supertest').agent(app.listen(3000));

describe('Hello world', () => {
  it('should say hello', (done) => {
    request
      .get('/api')
      .expect(200)
      .expect('Hello world API!', done);
  });
});
