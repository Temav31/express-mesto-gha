const Card = require("../models/card");
// ошибки для проверки ошибок
const {
  ERROR_INVALID_DATA,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
} = require("../utils/errors");
// получение карточек
const getCard = (req, res) => {
  console.log("hi");
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) =>
      res.status(404).send({
        maessege: "Ошибка сервера",
        err: err.message,
        stack: err.stack,
      })
    );
};
// создать карточку
const createCard = (req, res) => {
  Card.create(req.body)
    .then((cards) => res.status(201).send(cards))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_INVALID_DATA).send({
          message: "Некоректные данные",
        });
      } else {
        res.status(ERROR_SERVER).send({
          message: "Ошибка сервера",
          err: err.message,
          stack: err.stack,
        });
      }
    });
};
// поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => new Error("Not Found"))
    .then((card) => res.status(201).send(card))
    // обработка ошибок
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_INVALID_DATA).send({ message: "Некоректные данные" });
      } else if (err.message === "Not Found") {
        res.status(ERROR_NOT_FOUND).send({ message: "Такой карточки нет" });
      } else {
        res.status(ERROR_SERVER).send({
          message: "Ошибка сервера",
          err: err.message,
          stack: err.stack,
        });
      }
    });
};
// убрать лайк карточке
const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => new Error("Not Found"))
    .then((card) => res.status(201).send(card))
    // обработка ошибок
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_INVALID_DATA).send({ message: "Некоректные данные" });
      } else if (err.message === "Not Found") {
        res.status(ERROR_NOT_FOUND).send({ message: "Такой карточки нет" });
      } else {
        res
          .status(ERROR_SERVER)
          .send({
            message: "Ошибка сервера",
            err: err.message,
            stack: err.stack,
          });
      }
    });
};
// удаление карточки
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => new Error("Not found"))
    .then(() => res.status(201).send({ message: "Карточка удалена" }))
    .catch((err) => {
    // обработка ошибок
      if (err.name === "Not found") {
        res.status(ERROR_NOT_FOUND).send({
          message: "Такой карточки нет",
        });
      } else {
        res.status(ERROR_SERVER).send({
          message: "Ошибка сервера",
          err: err.message,
          stack: err.stack,
        });
      }
    });
};
// экспорт контроллеров
module.exports = {
  getCard,
  createCard,
  deleteLikeCard,
  deleteCard,
  likeCard,
};
