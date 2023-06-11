const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      return res.send({ data: users })
    })
    .catch(next);
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = async (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  try {
    a = await bcrypt.hash(req.body.password, 10)
    b = await User.create({
      name,
      about,
      avatar,
      email,
      password: a
    })
  }
  catch(err) {
    next(err);
  }
  return res.status(200).send({ data: b });
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
    .catch(next);
};

module.exports.updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      };
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      } else {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d'});

        res.send({ token });

        return res.status(200).send({ data: user });
      }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      }
      return res.send({ data: user });
    })
    .catch(next);
};
