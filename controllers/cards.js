const Card = require("../models/card");
// ошибки для проверки ошибок
const AccessError = require("../utils/errors/AccessError");
const FoundError = require("../utils/errors/FoundError");
const DataError = require("../utils/errors/DataError");
const ServerError = require("../utils/errors/ServerError");
// получение карточек
const getCard = (req, res, next) => {
    Card.find({})
        .then((cards) => res.status(200).send(cards))
        .catch(() => next(new ServerError()));
};
// создать карточку
const createCard = (req, res, next) => {
    const { _id } = req.user;
    const { name, link } = req.body;
    // создание карточки и определяет кто пользователь
    Card.create({ name, link, owner: _id })
        .then((card) => res.status(201).send(card))
        .catch((err) => {
            if (err.name === "ValidationError") {
                next(new DataError("Некоректные данные"));
            } else {
                next(new ServerError());
            }
        });
};
// поставить лайк карточке
const likeCard = (req, res, next) => {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
        .orFail(() => new Error("Not Found"))
        .then((card) => res.status(200).send(card))
        // обработка ошибок
        .catch((err) => {
            if (err.message === "Not found") {
                next(new FoundError("Такого пользователя нет"));
            } else if (err.name === "CastError") {
                next(new DataError("Некоректные данные"));
            } else {
                next(new ServerError());
            }
        });
};
// убрать лайк карточке
const deleteLikeCard = (req, res, next) => {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
        .orFail(() => new Error("Not Found"))
        .then((card) => res.status(200).send(card))
        // обработка ошибок
        .catch((err) => {
            if (err.message === "Not found") {
                next(new FoundError("Такого пользователя нет"));
            } else if (err.name === "CastError") {
                next(new DataError("Некоректные данные"));
            } else {
                next(new ServerError());
            }
        });
};
// удаление карточки
const deleteCard = (req, res, next) => {
    const user = req.user._id;
    Card.findById(req.params.id)
        .orFail(() => new Error("Not found"))
        .then((card) => {
            if (!card) {
                return next(new FoundError("Такого пользователя нет"));
            }
            if (card.owner.toString() !== user) {
                return next(new AccessError("Вы не можете удалить не свою карточку"));
            }
            return card
                .deleteOne()
                .then(() => {
                    res.status(201).send({ message: "Карточка удалена" });
                })
                .catch((err) => next(err));
        })
        .catch((err) => {
            if (err.message === "Not found") {
                next(new FoundError("Такого пользователя нет"));
            } else if (err.name === "CastError") {
                next(new DataError("Некоректные данные"));
            } else {
                next(new ServerError());
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