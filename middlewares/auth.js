const jwt = require('jsonwebtoken');
const AutoriztionError = require('../errors/AutoriztionError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AutoriztionError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new AutoriztionError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
