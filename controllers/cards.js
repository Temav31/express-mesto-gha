const Card = require('../models/card');
// ошибки для проверки ошибок
const AccessError = require('../utils/errors/AccessError');
const FoundError = require('../utils/errors/FoundError');
// 403 ForbiddenError 404 другая
// получение карточек
module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
};
// создать карточку
module.exports.createCard = (req, res, next) => {
  // const owner = req.user._id;
  const { name, link } = req.body;
  // создание карточки и определяет кто пользователь
  Card.create({ name, link, owner: req.user })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => next(err));
};
// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new FoundError('Пользователь не найден');
      }
      res.status(200).send({ data: card });
    })
    // обработка ошибок
    .catch((err) => next(err));
};
// убрать лайк карточке
module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new FoundError('Пользователь не найден');
      }
      res.status(200).send({ data: card });
    })
    // обработка ошибок
    .catch((err) => next(err));
};
// удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new FoundError('Такого пользователя нет'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new AccessError('Вы не можете удалить не свою карточку'));
      }
      return card.deleteOne().then(() => {
        res.status(200).send({ message: 'Карточка удалена' });
      });
    })
    .catch((err) => next(err));
};
