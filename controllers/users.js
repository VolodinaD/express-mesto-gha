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
      if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      } else {
        res.status(400).send({ message: 'Передан некорректный id пользователя.' });
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
  // eslint-disable-next-line max-len
  User.findByIdAndUpdate(req.user._id, { name: req.user.name, about: req.user.about }, { new: true })
    .then((user) => {
      if (req.user.name.length >= 2 && req.user.name.length <= 30
        && req.user.about.length >= 2 && (req.user.about.length <= 30)) {
        res.send({ data: user });
      }
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === NotFoundError.name) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.user.avatar }, { new: true })
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
