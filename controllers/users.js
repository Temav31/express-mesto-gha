const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const User = require("../models/user");
// ошибки для проверки ошибок
const { ERROR_PASSWORD } = require("../utils/errors");
const FoundError = require("../utils/errors/FoundError");
const ConflictError = require("../utils/errors/ConflictError");
const DataError = require("../utils/errors/DataError");
const SignInError = require("../utils/errors/SignInError");
const ServerError = require("../utils/errors/ServerError");
// регистрация
const createUser = (req, res, next) => {
    const { name, about, avatar, email, password } = req.body;
    bcrypt
        .hash(String(password), 10)
        .then((hashedPassword) => {
            User.create({
                name,
                about,
                avatar,
                email,
                password: hashedPassword,
            }).then((user) => {
                // console.log("hi");
                res.send({ data: user });
            });
        })
        .catch((err) => {
            console.log("hi");
            if (err.code === 11000) {
                next(new ConflictError("Такого пользователя не существует"));
            } else if (err.name === "ValidationError") {
                next(new DataError("Некоректные данные"));
            } else {
                next(new ServerError());
            }
        });
};
// аутентификация
const login = (req, res, next) => {
    // console.log("hi");
    const { email, password } = req.body;
    User.findOne({ email })
        .select("+password")
        .then((user) => {
            if (!user) {
                return Promise.reject(new Error("Неправильные данные"));
            }
            return bcrypt
                .compare(String(password), user.password)
                .then((isValidUser) => {
                    if (isValidUser) {
                        // создлали jwt
                        const jwt = jsonWebToken.sign({
                                _id: user._id,
                            },
                            "SECRET", { expiresIn: "7d" }
                        );
                        // прикрепили к куке
                        res.cookie("jwt", jwt, {
                            maxAge: 360000 * 24 * 7,
                            httpOnly: true,
                            // sameSite: true,
                        });
                        res.send({ data: user.toJSON() });
                    } else {
                        res.send({ message: "Неправильные данные" });
                    }
                });
        })
        .catch((err) => {
            console.log(err.name);
            if (err.message === "Неправильные данные") {
                next(new SignInError("Неправильные почта или пароль"));
            } else if (err.name === "ValidationError") {
                next(new DataError("Некоректные данные"));
            } else {
                next(new ServerError());
            }
        });
};
// получение пользователей
const getUsers = (req, res, next) => {
    User.find({})
        .then((users) => res.send(users))
        .catch(() => next(new ServerError()));
};
// получение пользователей по id
const getUserById = (req, res, next) => {
    // console.log("hi");
    User.findById(req.params.id)
        .orFail(() => new Error("Not found"))
        .then((user) => {
            res.send(user);
        })
        // обработка ошибок
        .catch((err) => {
            // console.log("err.message");
            if (err.message === "Not found") {
                next(new FoundError("Такого пользователя нет"));
            } else if (err.name === "CastError") {
                next(new DataError("Некоректные данные"));
            } else {
                next(new ServerError());
            }
        });
};
// получить текущего пользователя
const getCurrentUser = (req, res, next) => {
    req.params.id = req.user._id;
    getUserById(req, res, next);
};
// обновление аватара
const UpdateAvatar = (req, res, next) => {
    const { image } = req.body;
    User.findByIdAndUpdate(
            req.user._id, { image }, { new: true, runValidators: true }
        )
        .orFail(() => new Error("Not Found"))
        .then((user) => res.send(user))
        // обработка ошибок
        .catch((err) => {
            if (err.name === "ValidationError") {
                next(new DataError("Некоректные данные"));
            } else if (err.message === "Not Found") {
                next(new FoundError("Такого пользователя нет"));
            } else {
                next(new ServerError());
            }
        });
};
// обновление профиля
const UpdateProfile = (req, res, next) => {
    const { _id } = req.user;
    const { name, about } = req.body;
    User.findByIdAndUpdate(
            _id, { name, about }, {
                new: true,
                runValidators: true,
            }
        )
        .orFail(new Error("Not Found"))
        .then((user) => res.send({ data: user }))
        // обработка ошибок
        .catch((err) => {
            if (err.name === "ValidationError") {
                next(new DataError("Некоректные данные"));
            } else if (err.message === "Not Found") {
                next(new FoundError("Такого пользователя нет"));
            } else {
                next(new ServerError());
            }
        });
};
// экспорт контроллеров
module.exports = {
    login,
    getUsers,
    createUser,
    getUserById,
    UpdateProfile,
    UpdateAvatar,
    getCurrentUser,
};