const session = require('express-session');
const FileStore = require('session-file-store')(session);

const sessionMiddleware = session({
    cookieName: 'session',
    secret: process.env.COOKIE_SECRET,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    store: new FileStore,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 3600000, secure: process.env.NODE_ENV === 'dev', httpOnly: true }
  });

  module.exports = sessionMiddleware;