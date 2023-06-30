const express = require("express");
// const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();

const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});
const users = [];
app.get("/users", (req, res) => {
  console.log("Слушаю /users");
  res.send(users);
});
app.use(bodyParser.json());
app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
