const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const SignInError = require("../utils/errors/SignInError");
// создание модели пользователя
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Жак-Ив Кусто",
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    about: {
        type: String,
        default: "Исследователь",
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    avatar: {
        type: String,
        default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
        validate: {
            validator: (v) => validator.isURL(v),
            message: "Некорректный URL",
        },
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => validator.isEmail(v),
            message: "Некорректная почта",
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});
userSchema.statics.findUserByCredentials = function(email, password) {
    return this.findOne({ email })
        .select("+password")
        .then((user) => {
            if (!user) {
                return Promise.reject(new SignInError("Неправильные данные"));
            }
            return bcrypt.compare(password, user.password).then((matched) => {
                if (!matched) {
                    return Promise.reject(new SignInError("Неправильные данные"));
                }
                return user;
            });
        });
};
// экспорт
module.exports = mongoose.model("user", userSchema);
