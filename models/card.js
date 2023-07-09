const mongoose = require("mongoose");
const avatarPattern = require("../utils/constants");
// создание модели карточки
const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator: (v) => avatarPattern.test(v),
            message: "Введите ссылку",
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: [],
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // { versionKey: false }
});
// экспорт
module.exports = mongoose.model("card", cardSchema);