const request = require('supertest');
const { app } = require('../handlers.js');

describe('GET Home Page', () => {
  it('should get the home page / path', done => {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });
});

describe('GET nonExisting Url', () => {
  it('should return 404 for a non existing page', done => {
    request(app.serve.bind(app))
      .get('/badPage')
      .expect(404, done);
  });
});
