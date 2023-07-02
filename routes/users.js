const router = require("express").Router();
//  импорт обработчиков
const {
  getUsers,
  createUser,
  getUserById,
  UpdateProfile,
  UpdateAvatar,
} = require("../controllers/users");
// обработка путей
router.patch('/me', UpdateProfile);
router.patch('/me/avatar', UpdateAvatar);
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
// экспорт роута
module.exports = router;
