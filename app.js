const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const react = require("eslint-plugin-import/config/react");
const userRouter = require('./routes/users');

const app = express();
app.use(express.json());
const { PORT = 3000 } = process.env;
// подключение к базе данных мангус
mongoose.connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
});

app.use(express.json());
// app.use(router);
// app.use((req, res, next) => {
//     req.user = {
//         _id: "5d8b8592978f8bd833ca8133", // вставьте сюда _id созданного в предыдущем пункте пользователя
//     };
//     next();
// });

app.use('/users', userRouter);

app.use('/*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
//
