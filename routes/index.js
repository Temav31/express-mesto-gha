const router = require("express").Router();
const { ERROR_NOT_FOUND } = require("../utils/errors");
// импорт из файла
const user = require("./users");
const card = require("./cards");
// обозначение роутов
router.use("/users", user);
router.use("/cards", card);
// обработка другого пути
router.use("/*", (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: "Страницы не существует" });
});
// экспорт
module.exports = router;
