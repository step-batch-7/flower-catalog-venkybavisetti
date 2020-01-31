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

describe('POST /register', () => {
  it('should post on the register url', done => {
    request(app.serve.bind(app))
      .post('/submitComment')
      .send('name=Ranbir&comment=hi+venky')
      .expect(301)
      .expect('Location', '/guestBook.html', done);
  });
});

describe('GET guestbook Page', () => {
  it('should get the guestPage page /guestBook.html path', done => {
    request(app.serve.bind(app))
      .get('/guestBook.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });
});
