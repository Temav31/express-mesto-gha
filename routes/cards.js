const router = require("express").Router();

const {
  getCard,
  createCard,
  deleteLikeCard,
  deleteCard,
  likeCard,
} = require("../controllers/cards");

router.get("/", getCard);
router.post("/", createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', deleteLikeCard);

module.exports = router;
