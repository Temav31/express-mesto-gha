// // классы ошибок
// class ServerError extends Error {
//     constructor(err) {
//         super(err);
//         this.message = "Ошибка";
//         this.statusCode = 500;
//     }
// }
// class AbstractError extends Error {
//     constructor(err) {
//         super(err);
//         this.message = "Пользователь неn найден";
//         this.statusCode = 500;
//     }
// }
const errorHandler = (err, req, res, next) => {
    // проверка ошибок
    if (err.statusCode) {
        res.status(err.statusCode).send({ message: err.message });
    } else {
        res.status(500).send({ message: "Ошибка сервера" });
    }
    console.log(err.statusCode);
    next();
};
module.exports = errorHandler;