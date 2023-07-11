const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
// ошибки для проверки ошибок
const FoundError = require('../utils/errors/FoundError');
const ConflictError = require('../utils/errors/ConflictError');
const DataError = require('../utils/errors/DataError');
// const SignInError = require('../utils/errors/SignInError');
const ServerError = require('../utils/errors/ServerError');
// регистрация
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt
    .hash(String(password), 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      })
        .then(() => {
          // console.log('hi');
          res.send({
            data: {
              name,
              about,
              avatar,
              email,
            },
          });
        })
        .catch((err) => {
          console.log('hi');
          if (err.code === 11000) {
            next(new ConflictError('Такого пользователя не существует'));
          } else if (err.name === 'ValidationError') {
            next(new DataError('Некоректные данные'));
          } else {
            next(new ServerError());
          }
        });
    })
    .catch(next);
};
// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные данные'));
      }
      return bcrypt
        .compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            return Promise.reject(new Error('Неправильные данные'));
          }
          // создлали jwt
          const jwt = jsonWebToken.sign(
            {
              _id: user._id,
            },
            'SECRET',
            { expiresIn: '7d' },
          );
          // прикрепили к куке
          res.cookie('jwt', jwt, {
            maxAge: 360000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });
          return res.send({ message: 'Авторизация прошла успешно' });
        });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.message === 'Неправильные данные') {
        next(new ConflictError('Неправильные почта или пароль'));
      } else {
        next(new ServerError());
      }
    });
};
// получение пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};
// получение пользователей по id
module.exports.getUserById = (req, res, next) => {
  // console.log('hi');
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new FoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    // обработка ошибок
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new DataError('Некоректные данные'));
        return;
      }
      next(err);
    });
};
// получить текущего пользователя
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new FoundError('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Некоректные данные'));
      } else if (err.message === 'Not Found') {
        next(new FoundError('Такого пользователя нет'));
      } else next(err);
    });
};
// обновление аватара
module.exports.UpdateAvatar = (req, res, next) => {
  const { image } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { image },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    // обработка ошибок
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Некоректные данные'));
      } else if (err.message === 'Not Found') {
        next(new DataError('Такого пользователя нет'));
      } else next(err);
    });
};
// обновление профиля
module.exports.UpdateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new FoundError('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Некоректные данные'));
      } else if (err.message === 'Not Found') {
        next(new DataError('Такого пользователя нет'));
      } else next(err);
    });
};
