const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
   secret_number: {
        type: Number,
        required: true
   },
   user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
   },
   created_at: {
      type: Date,
      default: Date.now
   }
})

const Game = mongoose.model('Game', gameSchema);
exports.Game = Game;