const router = require("express").Router();
//  импорт обработчиков
const {
  getCard,
  createCard,
  deleteLikeCard,
  deleteCard,
  likeCard,
} = require("../controllers/cards");
// обработка путей
router.get("/", getCard);
router.post("/", createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', deleteLikeCard);
// экспорт роута
module.exports = router;
