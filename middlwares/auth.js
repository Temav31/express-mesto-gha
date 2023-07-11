const jwt = require('jsonwebtoken');
const SignInError = require('../utils/errors/SignInError');

const { JWT_SECRET } = require('../utils/constants');
// мидлвара
const auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;
  if (!token) {
    return next(new SignInError('Неправильная авторизация'));
  }
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new SignInError('Неправильная авторизация'));
  }
  req.user = payload;
  return next();
};
module.exports = auth;
