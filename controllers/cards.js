const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const DefaultError = require('../errors/DefaultError');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
      // eslint-disable-next-line no-console
      console.log(req.user._id);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === ValidationError.name) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => res.send({ data: card }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === NotFoundError.name) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === ValidationError.name) {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else if (err.name === NotFoundError.name) {
        res.status(404).send({ message: 'Передан несуществующий id карточки.' });
      } else if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === ValidationError.name) {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else if (err.name === NotFoundError.name) {
        res.status(404).send({ message: 'Передан несуществующий id карточки.' });
      } else if (err.name === DefaultError.name) {
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};