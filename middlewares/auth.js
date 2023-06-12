const jwt = require('jsonwebtoken');
const AutoriztionError = require('../errors/AutoriztionError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AutoriztionError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch(err) {
    next(err);
  }

  req.user = payload;

  next();
};
