'use strict';
const request = require('supertest');
const fs = require('fs');
const sinon = require('sinon');
const { app } = require('../handlers.js');
const App = app.serve.bind(app);

describe('GET Home Page', () => {
  it('should get the home page / path', done => {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Length', '777')
      .expect('Content-Type', 'text/html', done);
  });
  it('should get the path /css/homeStyles.css', done => {
    request(App)
      .get('/css/homeStyles.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-Length', '229', done);
  });
  it('should get the path /js/hideImage.js', done => {
    request(App)
      .get('/js/index.js')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'application/javascript')
      .expect('Content-Length', '298', done);
  });
  it('should get the path /images/freshorigins.jpg', done => {
    request(App)
      .get('/images/freshorigins.jpg')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'image/jpg', done);
  });
  it('should get the path /images/animated-flower-image-0021.gif', done => {
    request(App)
      .get('/images/animated-flower-image-0021.gif')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'image/gif', done);
  });
});

describe('POST /submitComment', () => {
  beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
  afterEach(() => sinon.restore());
  it('should post on the submitComment url', done => {
    request(app.serve.bind(app))
      .post('/submitComment')
      .send('name=naveen&comment=hello')
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

describe('GET method not allowed ', () => {
  it('should return 400 for a non existing method', done => {
    request(app.serve.bind(app))
      .put('/')
      .expect(400, done);
  });
});

describe('GET nonExisting Url', () => {
  it('should return 404 for a non existing page', done => {
    request(app.serve.bind(app))
      .get('/badPage')
      .expect(404, done);
  });
});
