class AccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
// экпорт ошибки
module.exports = AccessError;
