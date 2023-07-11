module.exports = ((err, req, res, next) => {
  //   res.status(err.statusCode ? err.statusCode : 500).send({ message: err.message });
  //   next();
  // });
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'Произошла ошибка на сервере' : message,
    });

  next();
});
