class ServerError extends Error {
  constructor() {
    super('Ошибка сервера');
    this.statusCode = 500;
  }
}
// экпорт ошибки
module.exports = ServerError;
