const express = require('express');
const favicon = require('serve-favicon');
// const ReactSSR = require('react-dom/server');
const bodyParser = require('body-parser');
const session = require('express-session');

const fs = require('fs');
const path = require('path');

const serverRender = require('./utils/serverRender');

const isDev = process.env.NODE_ENV === 'development';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  reserve: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')));
app.use('/api/user', require('./utils/handleLogin'));
app.use('/api', require('./utils/proxy'));

if (!isDev) {
  const serverEntry = require('../dist/serverEntry');
  const template = fs.readFileSync(path.resolve(__dirname, '../dist/server.ejs'), 'utf8');
  app.use('/public', express.static(path.resolve(__dirname, '../dist')));

  app.get('*', function (req, res, next) {
    serverRender(serverEntry, template, req, res).catch(next);
  });
} else {
  const devStatic = require('./utils/devStatic');
  devStatic(app);
}
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send(err)
})

app.listen(3333, function () {
  console.log('App listen at 3333');
});
