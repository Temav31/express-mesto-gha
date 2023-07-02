const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");
// константы
const app = express();
app.use(express.json());
const { PORT = 3000 } = process.env;
// // подключаемся к серверу mongo
mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
});
// роуты
app.use(router);
// хардкодим пользователя
app.use((req, res, next) => {
  req.user = {
    _id: '64a1368d2318b016942483e6',
  };
  next();
});
// порт
app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});