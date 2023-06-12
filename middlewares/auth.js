const jwt = require('jsonwebtoken');
const AutoriztionError = require('../errors/AutoriztionError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AutoriztionError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch(err) {
    next(err);
  }

  req.user = payload;

  next();
};
