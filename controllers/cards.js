const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      return res.send({ data: cards })
    })
    .catch(() => {
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      return res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        return res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка с указанным id не найдена.');
      };
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id карточки.' });
      } else if (err.name === 'NotFoundError') {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка с указанным id не найдена.');
      };
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else if (err.name === 'NotFoundError') {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена.' });
      } else {
        return res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка с указанным id не найдена.');
      };
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else if (err.name === 'NotFoundError') {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена.' });
      } else {
        return res.status(500).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};
