const Card = require("../models/card");
// ошибки для проверки ошибок
const AccessError = require("../utils/errors/AccessError");
const FoundError = require("../utils/errors/FoundError");
const DataError = require("../utils/errors/DataError");
const ServerError = require("../utils/errors/ServerError");
const { errors } = require("celebrate");
// получение карточек
module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};
// создать карточку
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  // создание карточки и определяет кто пользователь
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new DataError("Некоректные данные"));
      } else {
        next(err);
      }
    });
};
// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new FoundError("Пользователь не найден");
      }
      res.send({ data: card });
    })
    // обработка ошибок
    .catch((err) => {
      if (err.name === "CastError") {
        next(new DataError("Некоректные данные"));
      } else next(err);
    });
};
// убрать лайк карточке
module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new FoundError("Пользователь не найден");
      }
      res.send({ data: card });
    })
    // обработка ошибок
    .catch((err) => {
      if (err.name === "CastError") {
        next(new DataError("Некоректные данные"));
      } else next(err);
    });
};
// удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new FoundError("Такого пользователя нет"));
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new AccessError("Вы не можете удалить не свою карточку"));
      }
      return card.remove().then(() => {
        res.send({ message: "Карточка удалена" });
      });
    })
    .catch(next);
};
