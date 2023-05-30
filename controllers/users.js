const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const DefaultError = require('../errors/DefaultError');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
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
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан некорректный id пользователя.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === ValidationError.name) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, about: req.body.about,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      };
      res.send({ data: user });
      return;
    })
    .catch((err) => {
      if (err.name === ValidationError.name) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.name === NotFoundError.name) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден.' });
      } else if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      };
      res.send({ data: user });
      return;
    })
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
