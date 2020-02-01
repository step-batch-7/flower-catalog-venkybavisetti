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
      .expect('Content-Length', '381314')
      .expect('Content-Type', 'image/jpg', done);
  });
  it('should get the path /images/animated-flower-image-0021.gif', done => {
    request(App)
      .get('/images/animated-flower-image-0021.gif')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Length', '65088')
      .expect('Content-Type', 'image/gif', done);
  });
});

describe('Abeliophyllum Page', () => {
  it('should get the path /Abeliophyllum.html', done => {
    request(App)
      .get('/Abeliophyllum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1547', done);
  });
  it('should get the path /css/Abeliophyllum.css', done => {
    request(App)
      .get('/css/individualFlowers.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-Length', '248', done);
  });
  it('should get the path /images/Abeliophyllum.jpg', done => {
    request(App)
      .get('/images/pbase-Abeliophyllum.jpg')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'image/jpg', done);
  });
  it('should get the path /docs/Abeliophyllum.pdf', done => {
    request(App)
      .get('/pdfs/Abeliophyllum.pdf')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-length', '35864')
      .expect('Content-Type', 'application/pdf', done);
  });
});

describe('Ageratum Page', () => {
  it('should get the path /Ageratum.html', done => {
    request(App)
      .get('/Ageratum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '1209', done);
  });
  it('should get the path /css/Ageratum.css', done => {
    request(App)
      .get('/css/individualFlowers.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-Length', '248', done);
  });
  it('should get the path /images/Ageratum.jpg', done => {
    request(App)
      .get('/images/pbase-ageratum.jpg')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'image/jpg', done);
  });
  it('should get the path /pdfs/Ageratum.pdf', done => {
    request(App)
      .get('/pdfs/Ageratum.pdf')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'application/pdf', done)
      .expect('Content-Length', '140228');
  });
});

describe('GuestBook Page', () => {
  it('should get the path /GuestBook.html', done => {
    request(App)
      .get('/guestBook.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '3000', done);
  });
  it('should get the path /css/GuestBook.css', done => {
    request(App)
      .get('/css/guestBookStyle.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css')
      .expect('Content-Length', '507', done);
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
  it('Should give file not found if file not exist', done => {
    request(App)
      .post('/badFile')
      .set('Accept', '*/*')
      .send('name=raja&comment=wonderful+site')
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect('Content-Length', '9')
      .expect('Not Found', done);
  });
});

describe('FILE NOT FOUND', () => {
  it('Should give file not found if file not exist', done => {
    request(App)
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404)
      .expect('Content-Type', 'text/plain')
      .expect('Content-Length', '9')
      .expect('Not Found', done);
  });
});

describe('METHOD NOT ALLOWED', () => {
  it('Should should give method not allowed for put method ', done => {
    request(App)
      .put('/')
      .set('Accept', '*/*')
      .expect(400)
      .expect('Content-Type', 'text/plain')
      .expect('Content-Length', '18')
      .expect('Method Not Allowed', done);
  });
});
