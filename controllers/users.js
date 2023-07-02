const User = require("../models/user");
// ошибки для проверки ошибок
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
// получение пользователей по id
const getUserById = (req, res) => {
  console.log("hi");
  User.findById(req.params.id)
    .orFail(() => new Error("Not found"))
    .then((user) => res.status(200).send(user))
    // обработка ошибок
    .catch((err) => {
      console.log(err.message);
      if (err.message === "Not found") {
        res.status(ERROR_NOT_FOUND).send({
          maessege: "Такого пользователя нет",
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
// обновление аватара
const UpdateAvatar = (req, res) => {
  const { image } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { image },
    { new: true, runValidators: true }
  )
    .orFail(() => new Error("Not Found"))
    .then((user) => res.send(user))
    // обработка ошибок
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_INVALID_DATA).send({ message: "Некоректные данные" });
      } else if (err.message === "Not Found") {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Такого пользователя нет" });
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
// обновление профиля
const UpdateProfile = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(new Error("Not Found"))
    .then((user) => res.send({ data: user }))
    // обработка ошибок
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_INVALID_DATA).send({ message: "Некоректные данные" });
      } else if (err.message === "Not Found") {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Такого пользователя нет" });
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
  getUsers,
  createUser,
  getUserById,
  UpdateProfile,
};
