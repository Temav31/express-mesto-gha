const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const { pattern } = require('../utils/constants');
const { validationUrl } = require('../utils/constants');
//  импорт обработчиков
const {
  getUsers,
  getUserById,
  UpdateProfile,
  UpdateAvatar,
  getCurrentUser,
} = require('../controllers/users');
// обработка путей
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  UpdateProfile,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().min(2).custom(validationUrl),
    }),
  }),
  UpdateAvatar,
);
router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex(),
    }),
  }),
  getUserById,
);
// экспорт роута
module.exports = router;
