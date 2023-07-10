class FoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
// экпорт ошибки
module.exports = FoundError;
