const User = require("../models/user");
const {
  ERROR_INVALID_DATA,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
} = require("../utils/errors");
// получение пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) =>
      res.status(ERROR_SERVER).send({
        maessege: "Ошибка сервера",
        err: err.message,
        stack: err.stack,
      })
    );
};
// создание пользователя
const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_INVALID_DATA)
          .send({
            message: 'Некоректные данные',
          });
      } else {
        res
          .status(ERROR_SERVER)
          .send({
            message: 'Ошибка сервера',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};
// получение пользователей по id
const getUserById = (req, res) => {
  console.log("hi");
  User.findById(req.params.id)
    .orFail(() => new Error("Not found"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err.message);
      if (err.message === "Not found") {
        res.status(ERROR_NOT_FOUND).send({
          maessege: "Пользователь не найден",
        });
      } else {
        res.status(ERROR_SERVER).send({
          maessege: "Ошибка сервера",
          err: err.message,
          stack: err.stack,
        });
      }
    });
};
// экспорт контроллеров
module.exports = {
  getUsers,
  createUser,
  getUserById,
};
