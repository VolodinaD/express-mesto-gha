require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const ValidationError = require('./errors/ValidationError');
const NotFoundError = require('./errors/NotFoundError');
const AutoriztionError = require('./errors/AutoriztionError');
const DeleteCardError = require('./errors/DeleteCardError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors);
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); 
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(http|https):\/\/[^ "]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.use(auth);
app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена.')));
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  if (err.name === 'CastError' || err.name === ValidationError.name) {
    res.status(400).send({ message: 'Переданы некорректные данные.' });
  } else if (err.name === AutoriztionError.name) {
    res.status(401).send({ message: err.message });
  } else if (err.name === DeleteCardError.name) {
    res.status(403).send({ message: err.message });
  } else if (err.name === NotFoundError.name) {
    res.status(404).send({ message: err.message });
  } else if (err.code === 11000) {
    res.status(409).send({ message: 'Email уже существует.' });
  } else {
    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
  next();
});

app.listen(PORT);
