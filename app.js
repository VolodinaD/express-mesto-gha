const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users.js');
const ValidationError = require('./errors/ValidationError');
const NotFoundError = require('./errors/NotFoundError');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(/^(http|https):\/\/[^ "]+$/)),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.use(auth);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена.' });
});
app.use(errors());
app.use((err, req, res, next) => {
  if (err.name === 'CastError' || ValidationError.name) {
    res.status(400).send({ message: 'Переданы некорректные данные.' });
  } else if (err.name === NotFoundError.name) {
    res.status(404).send({ message: err.message });
  } else if (err.code === 11000) {
    res.status(409).send({ message: 'Email уже существует.' });
  } else {
    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
