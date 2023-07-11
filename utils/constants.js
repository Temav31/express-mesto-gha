const pattern = /^(https?:\/\/)+[^\s]*/;
const avatarPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const validationUrl = (url) => {
  if (avatarPattern.test(url)) {
    return url;
  }
  throw new Error('Некорректный url');
};
const { JWT_SECRET } = process.env;
// экспорт
module.exports = {
  pattern,
  validationUrl,
  JWT_SECRET,
};
