const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isWon: {
        type: Boolean,
        required: true,
    },
    attempt: {
        type: Number,
        required: true,
        default: 0
    },
    winner_picture: {
        type: String,
        default: 'https://res.cloudinary.com/arccity/image/upload/v1682872104/lose_wudhb0.png'
    },
    loser_picture: {
        type: String,
        default: 'https://res.cloudinary.com/arccity/image/upload/v1682872104/win_c2cxow.png'
    }
})

const GameResult = mongoose.model('GameResult', gameResultSchema);
exports.GameResult = GameResult;