const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const errorHandler = require('./middlwares/error');
// константы
const app = express();
app.use(express.json());
const { PORT = 3000 } = process.env;
// // подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});
// роуты
app.use(cookieParser());
app.use(router);
app.use(errors());
app.use(errorHandler);
// порт
app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
