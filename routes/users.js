const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
//  импорт обработчиков
const {
    getUsers,
    getUserById,
    UpdateProfile,
    UpdateAvatar,
    getCurrentUser,
} = require("../controllers/users");
// валидация
const validation = celebrate({
    params: Joi.object().keys({
        cardId: Joi.string().length(24).required(),
    }),
});
// обработка путей
router.get("/me", getCurrentUser);
router.patch("/me", validation, UpdateProfile);
router.patch("/me/avatar", validation, UpdateAvatar);
router.get("/", getUsers);
router.get("/:id", validation, getUserById);
// экспорт роута
module.exports = router;