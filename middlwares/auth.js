const jwt = require('jsonwebtoken');
const SignInError = require('../utils/errors/SignInError');
// const { JWT_SECRET } = require('../utils/constants');
// мидлвара
const auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;
  try {
    if (!token) {
      next(new SignInError('Неправильная авторизация'));
    }
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    next(new SignInError('Неправильная авторизация'));
  }
  req.user = payload;
  return next();
};
module.exports = auth;
