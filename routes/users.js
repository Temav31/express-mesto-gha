const router = require("express").Router();
//  импорт обработчиков
const { getUsers, createUser, getUserById } = require("../controllers/users");
// обработка путей
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
// экспорт роута
module.exports = router;
