const { number } = require('joi');
const mongoose = require('mongoose');

const guessSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    attempt: {
        type: Number,
        default: 0
    },
    guess_number: {
        type: Number,
        required: true
    },
    M: {
        type: Number,
    },
    P: {
        type: Number,
    }
})

const Guess = mongoose.model('Guess', guessSchema);
exports.Guess = Guess;