const express = require('express');

const app = express();

const { guestBookPage, onComment } = require('./handlers');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/guestBook.html', guestBookPage);
app.post('/submitComment', onComment);

module.exports = { app };
