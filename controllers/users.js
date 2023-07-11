const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
// ошибки для проверки ошибок
const FoundError = require('../utils/errors/FoundError');
const ConflictError = require('../utils/errors/ConflictError');
const DataError = require('../utils/errors/DataError');
// const ServerError = require('../utils/errors/ServerError');
const { JWT_SECRET } = require('../utils/constants');
// const { errors } = require('celebrate');
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
      });
    })
    .then((user) => {
      if (!user) {
        return next(new FoundError('Пользователя не существует'));
      }
      return res.send({
        data: {
          name,
          about,
          avatar,
          email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такого пользователя не существует'));
      } else if (err.name === 'ValidationError') {
        next(new DataError('Некоректные данные'));
      } else {
        next(err);
      }
    });
};
// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    // .select('+password')
    .then((user) => {
      // создлали jwt
      const jwt = jsonWebToken.sign(
        {
          _id: user._id,
        },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', jwt, {
        maxAge: 360000 * 24 * 7,
        httpOnly: true,
      })
        .send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        });
    })
    .catch(next);
};
// получение пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};
// получение пользователей по id
module.exports.getUserById = async (req, res, next) => {
  // console.log('hi');
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new FoundError('Такого пользователя не существует');
    }
    res.send({ data: user });
    // обработка ошибок
  } catch (err) {
    if (err.name === 'CastError') {
      next(new DataError('Некоректные данные'));
    } else {
      next(err);
    }
  }
};
// получить текущего пользователя
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new FoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch(next);
};
// обновление аватара
module.exports.UpdateAvatar = (req, res, next) => {
  const { image } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { image },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new FoundError('Такого пользователя не существует');
      } else { res.send(user); }
    })
    // обработка ошибок
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Некоректные данные'));
      } else {
        next(err);
      }
    });
};
// обновление профиля
module.exports.UpdateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      throw new FoundError('Такого пользователя не существует');
    }
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new DataError('Некоректные данные'));
    } else {
      next(err);
    }
  }
};
