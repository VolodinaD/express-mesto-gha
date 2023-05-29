const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const DefaultError = require('../errors/DefaultError');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
      }
      res.send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === ValidationError.name) {
        res.status(400).send({ message: 'Передан некорректный id пользователя.' });
      } else if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === ValidationError.name) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: 'Дарья', about: 'Обо мне' }, { new: true })
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === ValidationError.name) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === NotFoundError.name) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      } else if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: 'https://avatars.mds.yandex.net/i?id=3725789a1a4a6355cd0630f3a9ebd85e8a14bbc1-8249078-images-thumbs&n=13' }, { new: true })
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === ValidationError.name) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === NotFoundError.name) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      } else if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};
