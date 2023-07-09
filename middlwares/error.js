// const errorHandler = (err, req, res, next) => {
//     // проверка ошибок
//     if (err.statusCode) {
//         res.status(err.statusCode).send({ message: err.message });
//     } else {
//         res.status(500).send({ message: "Ошибка сервера" });
//     }
//     console.log(err.statusCode);
//     next();
// };
module.exports = ((err, req, res, next) => {
    res.status(err.statusCode ? err.statusCode : 500).send({ message: err.message });
    next();
});
// module.exports = errorHandler;