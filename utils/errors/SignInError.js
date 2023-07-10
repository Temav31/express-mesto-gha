class SignInError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
// экпорт ошибки
module.exports = SignInError;
