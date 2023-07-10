const mongoose = require("mongoose");
const validator = require("validator");
const isEmail = require("validator/lib/isEmail");
// const avatarPattern = require("../utils/constants");
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
        // unique: true,
        // validate: {
        //     validator: (v) => validator.isEmail(v),
        //     message: "Некорректная почта",
        // },
        validate: {
            validator: isEmail,
            message: "Некорректная почта",
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    // { versionKey: false }
});
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};
// экспорт
module.exports = mongoose.model("user", userSchema);