const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const FoundError = require('../utils/errors/FoundError');
const { pattern } = require('../utils/constants');
// импорт из файла
const user = require('./users');
const card = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlwares/auth');
// регистрация
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().min(3),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(pattern),
    }),
  }),
  createUser,
);
// аутенфикация
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().min(3),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.use(auth);
// обозначение роутов
router.use('/users', user);
router.use('/cards', card);
router.use(errors());
// обработка другого пути
router.use('/*', (req, res, next) => {
  next(new FoundError('Страницы не существует'));
});
// экспорт
module.exports = router;
