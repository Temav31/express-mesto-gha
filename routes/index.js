const router = require("express").Router();
const { ERROR_NOT_FOUND } = require("../utils/errors");
const { celebrate, Joi, errors } = require("celebrate");
const { pattern } = require("../utils/constants");
// импорт из файла
const user = require("./users");
const card = require("./cards");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlwares/auth");
// регистрация и аутентификация
router.post(
    "/signup",
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email().min(3),
            password: Joi.string().required().min(3),
            name: Joi.string().min(2).max(30),
            about: Joi.string().min(2).max(30),
            avatar: Joi.string().pattern(pattern),
        }),
    }),
    createUser
);
router.post(
    "/signin",
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email().min(3),
            password: Joi.string().required().min(3),
        }),
    }),
    login
);
router.use(auth);
// обозначение роутов
router.use("/users", user);
router.use("/cards", card);
router.use(errors());
// обработка другого пути
router.use("/*", (req, res) => {
    res.status(ERROR_NOT_FOUND).send({ message: "Страницы не существует" });
});
// экспорт
module.exports = router;