const router = require("express").Router();
//  импорт обработчиков
const {
    getUsers,
    getUserById,
    UpdateProfile,
    UpdateAvatar,
    getCurrentUser
} = require("../controllers/users");
// обработка путей
router.patch('/me', UpdateProfile);
router.patch('/me/avatar', UpdateAvatar);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.get('/me', getCurrentUser);
// экспорт роута
module.exports = router;