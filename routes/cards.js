const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { pattern } = require('../utils/constants');
//  импорт обработчиков
const {
  getCard,
  createCard,
  deleteLikeCard,
  deleteCard,
  likeCard,
} = require('../controllers/cards');
// обработка путей
router.get('/', getCard);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).required().hex(),
    }),
  }),
  likeCard,
);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().pattern(pattern).required(),
    }),
  }),
  createCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).required().hex(),
    }),
  }),
  deleteLikeCard,
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).required().hex(),
    }),
  }),
  deleteCard,
);
// экспорт роута
module.exports = router;
