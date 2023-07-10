module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ massage: err.message });
  } else {
    res.status(500).send({ massage: 'Ошибка сервера' });
    next();
  }
};
