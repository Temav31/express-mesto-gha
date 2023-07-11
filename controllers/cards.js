const Card = require('../models/card');
// ошибки для проверки ошибок
const AccessError = require('../utils/errors/AccessError');
const FoundError = require('../utils/errors/FoundError');
const DataError = require('../utils/errors/DataError');
const ServerError = require('../utils/errors/ServerError');
// получение карточекreqgweg
module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => next(new ServerError()));
};
// создать карточку
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  // создание карточки и определяет кто пользователь
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Некоректные данные'));
      } else {
        next(new ServerError());
      }
    });
};
// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not Found'))
    .then((card) => {
      res.send(card);
    })
    // обработка ошибок
    .catch((err) => {
      if (err.message === 'Not Found') {
        next(new FoundError('Карточки не существует'));
      } else if (err.name === 'CastError') {
        next(new DataError('Некоректные данные карточки'));
      } else next(new ServerError());
    });
};
// убрать лайк карточке
module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not Found'))
    .then((card) => res.send(card))
    // обработка ошибок
    .catch((err) => {
      if (err.message === 'Not Found') {
        next(new FoundError('Карточки не существует'));
      } else if (err.name === 'CastError') {
        next(new DataError('Некоректные данные карточки'));
      } else next(new ServerError());
    });
};
// удаление карточки
module.exports.deleteCard = (req, res, next) => {
  // const { cardId } = req.params;
  Card.findById(req.params.cardId)
    .orFail(new Error('Not Found'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new Error('Нельзя удалить чужую карточку'));
      }
      return Card.deleteOne(card).then(() => {
        res.send({ message: 'Карточка удалена' });
      });
    })
    .catch((err) => {
      if (err.message === 'Нельзя удалить чужую карточку') {
        next(new AccessError('Нельзя удалить чужую карточку'));
      } else if (err.message === 'Not Found') {
        next(new FoundError('Карточка не найдена'));
      } else if (err.name === 'CastError') {
        next(new DataError('Некоректные данные карточки'));
      } else next(new ServerError());
    });
};
