class DataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}
// экпорт ошибки
module.exports = DataError;
