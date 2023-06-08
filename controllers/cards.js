const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      return res.status(201).send({ data: card });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (card.owner === req.user._id) {
        if (card === null) {
          throw new NotFoundError('Карточка с указанным id не найдена.');
        }
        return res.status(200).send({ data: card });
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Передан несуществующий id карточки.');
      }
      return res.status(200).send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Передан несуществующий id карточки.');
      }
      return res.status(200).send({ data: card });
    })
    .catch(next);
};
