const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
//  импорт обработчиков
const {
    getUsers,
    getUserById,
    UpdateProfile,
    UpdateAvatar,
    getCurrentUser
} = require("../controllers/users");
// валидация
const validation = celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().length(24).required(),
    }),
});
// обработка путей
router.patch('/me', validation, UpdateProfile);
router.patch('/me/avatar', validation, UpdateAvatar);
router.get("/", getUsers);
router.get("/:id", validation, getUserById);
router.get('/me', getCurrentUser);
// экспорт роута
module.exports = router;