const jwt = require('jsonwebtoken');
const SignInError = require('../utils/errors/SignInError');
// мидлвара
const auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;
  try {
    if (!token) {
      return next(new SignInError('Неправильная авторизация'));
    }
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    return next(new SignInError('Неправильная авторизация'));
  }
  req.user = payload;
  return next();
};
module.exports = auth;
