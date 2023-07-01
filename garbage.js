const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const react = require("eslint-plugin-import/config/react");

// const router = require('./routes/index');

const User = require("./models/user")
// const

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
const users = [];
let id = 0;
app.get("/users", (req, res) => {
  console.log("Слушаю /users");
  res.send(users);
});
app.get("/users/:id", (req, res) => {
  console.log(req.params.id);
  console.log("hi");

  const { id } = req.params;
  const user = users.find((item) => item.id == Number(id));

  if(user){
  return res.status(200).send([users]);
  }
  return res.status(404).send({ message: 'User not found' });
});
app.post('/users', (req, res) => {
  console.log("req.body", req.body);

  id += 1;
  const newUser = {
    id,
    ...req.body,
  };
  users.push(newUser);

  res.status(201).send(newUser);
});
// app.use(bodyParser.json());
app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
//
